

import { writable } from 'svelte/store';
import { APIClient } from '$lib/scripts/api-client.js';


const apiClient = new APIClient();



/* 
  chains simple prompt functions together

  This was used when groq/claude/whatever was used to ping pong prompts back and forth
  but then decided to go simpler. It's useful though so keeping it around.

  usage:
    let description
    [description] = await Promise.all([
      chainPromptStreams(
        groqPromptStream,
        sheetDataStr,
        runId,
        datasets[sheetData.name]['magic']['descriptionResult']
      )()
        .then((result) => {
          const prompt = `Using the previous result: ${result}, please provide a summary of the data in French.`;
          return groqPromptStream(prompt, runId, datasets[sheetData.name]['magic']['summaryResult']);
        })
        .then(result => {
          console.log('done!', result);
          loadingState.askClaudeAboutSheet = 'done';
          return result;
        }),
    ]);
*/
export function chainPromptStreams(initialPromptFn, ...initialArgs) {
  return async function chainedPrompt() {
    const result = await initialPromptFn(...initialArgs).then(response => {
      const resultStoreIndex = initialArgs.findIndex(arg => arg.set);
      if (resultStoreIndex !== -1) {
        initialArgs[resultStoreIndex].set(response);
      }
      return response;
    });

    return {
      then: (nextFn, ...nextArgs) => {
        if (typeof nextFn === 'function') {
          return nextFn(result, ...nextArgs);
        } else {
          throw new Error('Invalid function passed to `then`');
        }
      },
      result,
    };
  };
}

export function extractJson(str) {
  const jsonObjects = [];

  // Try extracting JSON from <json> tags
  const jsonTagMatches = str.matchAll(/<json>([\s\S]*?)<\/json>/g);
  for (const match of jsonTagMatches) {
    try {
      const json = JSON.parse(match[1]);
      if (Array.isArray(json)) {
        jsonObjects.push(...json);
      } else {
        jsonObjects.push(json);
      }
    } catch (error) {
      // Ignore the error and continue with other formats
    }
  }

  // Try extracting JSON from markdown code blocks
  const markdownMatches = str.matchAll(/```(?:json)?\s*([\s\S]*?)```/g);
  for (const match of markdownMatches) {
    try {
      const json = JSON.parse(match[1]);
      if (Array.isArray(json)) {
        jsonObjects.push(...json);
      } else {
        jsonObjects.push(json);
      }
    } catch (error) {
      // Ignore the error and continue with other formats
    }
  }

  // If no valid JSON found, try parsing the entire string as JSON
  if (jsonObjects.length === 0) {
    try {
      const json = JSON.parse(str);
      if (Array.isArray(json)) {
        jsonObjects.push(...json);
      } else {
        jsonObjects.push(json);
      }
    } catch (error) {
      // Ignore the error and return an empty array
    }
  }
  return jsonObjects;
}




/* 

  files are temporarily loaded to 0x0.st so OpenAI can load them from URL

*/
export async function clientUploadToNullPointer({ content, fileData, extension = '.csv', runId }) {
  try {
    const formData = new FormData();

    if (content) {
      formData.append('content', content);
    } else if (fileData) {
      formData.append('file', fileData, `file${extension}`);
    } else {
      throw new Error('Either content or fileData must be provided');
    }

    formData.append('extension', extension);
    formData.append('runId', runId);

    console.log('[clientUploadToNullPointer] FormData contents:');
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    const result = await apiClient.fetchData({
      url: 'api/upload',
      method: 'POST',
      body: formData,
      onDone: (data) => {
        // console.log('[clientUploadToNullPointer] API response:', data);
      },
    });

    console.log('data:', result);
    return result.url;
  } catch (error) {
    console.error('[clientUploadToNullPointer] error:', error);
    throw error;
  }
}







export async function groqPromptStream(prompt, runId, resultStore) {

  try {
    let result = '';

    console.log('[groqPromptStream] prompt:', prompt)
    await new Promise((resolve, reject) => {
      apiClient.streamDataWithGetReader({
        url: 'https://groq-query.deno.dev/',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          isStreaming: true,
          text: prompt,
          model: 'llama70b',
          // model: 'mixtral',
        },
        onMessage: ({ done, data }) => {
          if (!done) {
            result += data.token;
            resultStore?.update(value => value + data.token);
          }
        },
        onError: (error) => {
          console.error('[groqPromptStream] error:', error);
          reject(error);
        },
        onDone: () => {
          console.log('[groqPromptStream] API response:', result);
          resolve();
        },
      });
    });

    return result;
  } catch (error) {
    console.error('[groqPromptStream] error:', error);
    throw error;
  }
}




export const isLoading = writable(false);






// UNUSED — all prompts moved to groq
export async function claudePromptStream(prompt, runId, resultStore) {

  try {
    let result = '';

    console.log('[claudePromptStream] prompt:', prompt, '---store---', resultStore)
    await new Promise((resolve, reject) => {
      apiClient.streamDataWithGetReader({
        url: 'https://claude-query.deno.dev/',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          isStreaming: true,
          text: prompt,
        },
        onMessage: ({ done, data }) => {
          if (!done) {
            result += data.token;
            resultStore?.update(value => value + data.token);
          }
        },
        onError: (error) => {
          console.error('[claudePromptStream] error:', error);
          reject(error);
        },
        onDone: () => {
          // console.log('[claudePromptStream] API response:', result);
          resolve();
        },
      });
    });

    return result;
  } catch (error) {
    console.error('[claudePromptStream] error:', error);
    throw error;
  }
}

// this is using OpenAI Assistants through a Deno Deploy proxy
// this is also unused bc each run takes many minutes. Everything moved to groq.
export async function sliceAssistStream(fileUrl, content, runId, resultStore) {
  const url = 'https://slicedice.deno.dev/stream/';

  try {
    let result = '';
    let parsedJson = null;
    let firstToken = true;

    isLoading.set(true);
    resultStore.set('Loading...');

    await new Promise((resolve, reject) => {
      apiClient.streamDataWithEventSource({
        url: `${url}${encodeURIComponent(fileUrl)}?content=${encodeURIComponent(content)}`,
        onMessage: ({ done, data }) => {
          if (!done) {
            result += data.token;
            if (firstToken) {
              resultStore.set(data.token);
              firstToken = false;
            } else {
              resultStore.update(value => value + data.token);
            }
          }
        },
        onError: (error) => {
          console.error('[sliceAssistStream] EventSource error:', error);
          isLoading.set(false);
          reject(error);
        },
        onDone: () => {
          // Try to extract JSON from <json> tags
          const jsonString = result.match(/<json>(.*?)<\/json>/s)?.[1];

          if (jsonString) {
            // Parse the JSON string from <json> tags
            try {
              parsedJson = JSON.parse(jsonString);
            } catch (e) {
              console.error('Error parsing JSON:', e);
            }
          }

          // console.log('[sliceAssistStream] API response:', result);

          isLoading.set(false);
          resolve();
        },
      });
    });

    return { results: result, json: parsedJson };
  } catch (error) {
    console.error('[sliceAssistStream] error:', error);
    isLoading.set(false);
    throw error;
  }
}


export async function extractFile(input, files, csvText, datasets, loadingState, startingState, isDraggingOver, loadingHasStarted, message) {
  isDraggingOver = false;
  loadingHasStarted = true;
  message = '';
  loadingState = startingState;

  if (!input && files.length === 0 && csvText.trim() === '') {
    message = 'Please upload a file or paste some CSV data!';
    loadingHasStarted = false;
    return { datasets, loadingState, loadingHasStarted, message, isDraggingOver };
  }


  try {
    const processFile = async (file, extension) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        let sheets, sheetNames;
        if (extension === 'xlsx' || extension === 'xls') {
          const wb = XLSX.read(new Uint8Array(reader.result), {
            type: "array",
            cellFormula: true,
            cellStyles: true,
          });
          sheets = convert(wb);
          sheets = sheets.filter(sheet => sheet.sheetName !== 'Export Summary');
          sheetNames = sheets.map((s) => s.sheetName);
        } else if (extension === 'csv') {
          const input = e.target.result;
          const delimiter = input.indexOf('\t') !== -1 ? '\t' : ',';
          const csvRows = input?.trim().split('\n');
          sheets = [{
            rows: csvRows.map(row => row.split(delimiter)),
            columns: Array.from({ length: csvRows[0].split(delimiter).length }, () => ({ width: '100px' })),
            data: csvRows.map(row => row.split(delimiter)),
            style: {},
            sheetName: 'Sheet1',
            mergeCells: []
          }];
          sheetNames = ['Sheet1'];
        }

        const runId = Math.random().toString(36).substring(2, 12);
        const sheetData = { runId, name: file ? file.name : 'csv_' + runId, sheets, sheetNames };
        await analyzeSheetData({ runId, sheetName: sheetData.name, sheetData, input: file ? null : input, file, extension });
      };

      if (file) {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(new Blob([input]));
      }
    };

    if (input && input?.trim() !== '') {
      await processFile(null, 'csv');
    }

    for (const file of files) {
      if (!Object.values(datasets).some(dataset => dataset.name === file.name)) {
        const extension = file.name.endsWith('.xlsx') ? 'xlsx' : file.name.endsWith('.xls') ? 'xls' : 'csv';
        await processFile(file, extension);
      }
    }
  } catch (e) {
    console.error('extractFile error:', e);
  }
  
  return { datasets, loadingState, loadingHasStarted, message, isDraggingOver };
}