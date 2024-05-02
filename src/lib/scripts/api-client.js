export class APIClient {

  async fetchData(options) {
    const {
      url,
      method = 'GET',
      body = null,
      headers = {},
      onDone = () => { },
    } = options;

    try {
      const fetchOptions = {
        method,
        headers: { ...headers },
      };

      if (body instanceof FormData) {
        fetchOptions.body = body;
      } else if (body) {
        fetchOptions.headers['Content-Type'] = 'application/json';
        fetchOptions.body = JSON.stringify(body);
      }

      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      const result = onDone(data);
      if (result instanceof Promise) {
        return result.then(() => data);
      } else {
        return Promise.resolve(data);
      }
    } catch (error) {
      console.error('Error in fetchData:', error);
      throw error;
    }
  }

  async streamDataWithEventSource(options) {
    const {
      url,
      onMessage,
      onError = () => { },
      onDone = () => { },
    } = options;

    try {
      return new Promise((resolve, reject) => {
        const eventSource = new EventSource(url);

        eventSource.onmessage = (event) => {
          if (event.data === '[DONE]') {
            eventSource.close();
            const result = onDone();
            if (result instanceof Promise) {
              result.then(() => resolve()).catch((error) => reject(error));
            } else {
              resolve();
            }
          } else {
            const data = JSON.parse(event.data);
            onMessage({ done: false, data });
          }
        };

        eventSource.onerror = (error) => {
          onError(error);
          reject(error);
        };
      });
    } catch (error) {
      console.error('Error in streamDataWithEventSource:', error);
      throw error;
    }
  }

  async streamDataWithGetReader(options) {
    const {
      url,
      method = 'GET',
      body = null,
      headers = {},
      onMessage,
      onError = () => { },
      onDone = () => { },
    } = options;

    try {
      const fetchOptions = {
        method,
        headers: { ...headers },
      };

      if (body instanceof FormData) {
        fetchOptions.body = body;
      } else if (body) {
        fetchOptions.headers['Content-Type'] = 'application/json';
        fetchOptions.body = JSON.stringify(body);
      }

      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const reader = response.body.getReader();
      let result = '';
      let isDone = false;

      return new Promise((resolve, reject) => {
        const readChunk = async () => {
          try {
            const { done, value } = await reader.read();

            if (done) {
              const doneResult = onDone(result);
              if (doneResult instanceof Promise) {
                await doneResult;
              }
              resolve(result);
              return;
            }

            const chunk = new TextDecoder().decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data:')) {
                const data = line.substring(5).trim();
                if (data === '[DONE]') {
                  isDone = true;
                  break;
                } else {
                  const parsedData = JSON.parse(data);
                  result += parsedData.token;
                  onMessage({ done: false, data: parsedData });
                }
              }
            }

            if (!isDone) {
              await readChunk();
            } else {
              const doneResult = onDone(result);
              if (doneResult instanceof Promise) {
                await doneResult;
              }
              resolve(result);
            }
          } catch (error) {
            reject(error);
          }
        };

        readChunk();
      });
    } catch (error) {
      console.error('Error in streamDataWithGetReader:', error);
      onError(error);
      throw error;
    }
  }
}