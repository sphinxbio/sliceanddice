<p align="center">
  <img src="https://sliceanddice.vercel.app/slicendice-card.png" height="300" alt="Slice n Dice Logo"/>
</p>
<p align="center">
  <em>A small experiment that uses LLMs to analyze and isolate data boundaries within messy spreadsheets. </em>
</p>
<!-- <p align="center">
    <img alt="Node version" src="https://img.shields.io/static/v1?label=node&message=%20%3E=20&logo=node.js&color=2334D058" />
</p> -->


<p align="center">
<a href="https://sheets.sphinxbio.com/">🔗 Try it here</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="https://twitter.com/sphinx_bio">🐦 @sphinx_bio</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="https://sphinxbio.com/">😼 Sphinx Bio</a>
</p>

Slice & Dice is an experiment in using AI to extract structured data from unstructured spreadsheets. Upload an Excel/CSV and watch the AI to (attempt) to identify slice the sheet up into multiple regions of datasets.

This is a work in progress, and everyone is welcome to contribute!

---


## 🔗 Try it here

Try out the [live demo on our website.](https://sheets.sphinxbio.com)

⚠️ Please don't upload any personal or private data in the demo! Your files will be visible to AI providers and our analytics platform ⚠️

Feel free to reach out about self-hosted or enterprise versions.



![gif demo](https://private-user-images.githubusercontent.com/3868520/326619422-e03d41e5-b15c-4176-b05c-5b06e8d3b26e.gif?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MTQ0MzQ3OTQsIm5iZiI6MTcxNDQzNDQ5NCwicGF0aCI6Ii8zODY4NTIwLzMyNjYxOTQyMi1lMDNkNDFlNS1iMTVjLTQxNzYtYjA1Yy01YjA2ZThkM2IyNmUuZ2lmP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9QUtJQVZDT0RZTFNBNTNQUUs0WkElMkYyMDI0MDQyOSUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNDA0MjlUMjM0ODE0WiZYLUFtei1FeHBpcmVzPTMwMCZYLUFtei1TaWduYXR1cmU9NjFkMWVkZmJkYWI3YzRiZjA5YTFmOGFiYzU0M2YzN2MxZDQ5YjljYTVkNmZmNzYyNTVkZmU5ZmJlNmFmOTU3MyZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QmYWN0b3JfaWQ9MCZrZXlfaWQ9MCZyZXBvX2lkPTAifQ.ffxOImWQN1zF3z0Og57Mot-0RiZWGoHigkkbkqw-ADI)


<span id="#works"></span>

## 👀 Discussion

Currently, the app sends the CSV/Excel data as text to a series of fast [Llama3](https://llama.meta.com/llama3/) or [Mixtral prompts](https://mistral.ai/news/mixtral-of-experts/), some to ask for boundaries, others to check for correctness. Previous attempts to use [LangChain](https://langchain.com/) agents, [OpenAI Assistants API](https://platform.openai.com/docs/assistants/overview) and a combination of Claude and OpenAI yielded fairly unimpressive results (and were very expensive and slow as well). Though Llama3 and Mixtral are very fast and affordable (especially through [Groq](https://groq.com/)) for prototype development and iteration, they do present various challenges and short-comings:
- No function calling or JSON mode (sometimes the results are not well-formatted)
- Small context window (large datasets won't work)
- Lack of planning, reasoning, and agent-like decision-making (all models are incredibly error-prone and generally poor at handling spreadsheets)

We wrote up a [blog post about the entire process](https://sphinxbio.com/post/ai-extraction-messy-spreadsheets)




<span id="#features"></span>

## 🎉 Features & Roadmap
Slice & Dice is a small experiment and playground for manipulating spreadsheets. We'd love to add more features like:
- **Manually create slices**: Create slices manually, and an LLM will add context like name/descriptions.
- **Manipulate sheets & slices**: Add a way to _Join & Concatenate datasets and slices_ to manipulate, merge, or generate new tabular datasets from sheets & slices.
- **Download tabular slices**: Create & download well-formed, tabular slices of data. 
- **Explore alternate UIs**: Add "Chat with sheets" and other UI modes to progressively get + edit the slices you need
- **Excel macro or Google Apps Script**: A few have asked for building this into Excel
- **Handle more messy use cases**: Many use cases will break the tool; add better slicing for more kinds of data. More use cases can be found under `src/lib/samples/dirtysheets`
- **UI improvements**: Clear/reset button and other UI improvements makes the demo more than a toy

We'd also like to work with the community to come up with better ways to overcome some of the severe limitations for handling spreadsheets. These might include using methods to identify data type (e.g. what kind of "messed up" is the data) and sub-tasks (e.g. given that we know a spreadsheet has a control and experiment arm, how can that be used to prompt a model?). There are lots of variations and possibilities, and we'd like to explore them with you!


## 🚀 Tech Stack
Note that we use Posthog for usage analytics on the demo site.
- ✅ **Framework**: [Sveltekit](https://kit.svelte.dev/) for frontend
- ✅ **Backend**: [Vercel](https://vercel.com) for hosting. [Deno Deploy](https://deno.com/deploy) for Groq API proxy.
- ✅ **Styling**: [TailwindCSS](https://tailwindcss.com).
- ✅ **LLMs**: [Llama3 70B and/or Mixtral 8x7b served by Groq](https://groq.com)
- ✅ **Analytics**: [Posthog](https://posthog.com)


<span id="#supporters"></span>

## Supporters

<p align="left">
  <img src="https://assets-global.website-files.com/64f63ffe0294045961ab6b54/661ac53a2c40cb9bd6d4376a_logo_colorized%20Brand.svg" height="50" alt="Sphinxbio Logo"/>
</p>

Many thanks to Sphinx Bio for sponsoring this project. If you'd like to work on this (and other cool) projects, [consider joining us](https://sphinxbio.notion.site/Careers-at-Sphinx-0a4c6a524b2344c299a79fd3da547545)! 

<span id="#license"></span>

## License
This project is licensed under the terms of the Apache 2.0 license.


<span id="#contributing"></span>

## Contributing

Nothing in life is certain except Death, Taxes, and Really Messy Spreadsheets. We're excited to permanently remove the spreadsheet problem! We'd love your contributions, so please submit ideas, and errors/bug reports on Github!



<span id="#acknowledgments"></span>

## Acknowledgements
This is a Sphinx Bio project! If you're interested in a hosted solution for your lab, please reach out.

Thanks to Harrison and the Langchain team for their help as well!