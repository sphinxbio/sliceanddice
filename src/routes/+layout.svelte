<script>

	import '$src/app.scss'
	// import '$src/blogalog.scss'

  import '@fontsource/inter/400.css';
  import '@fontsource/inter/500.css';
  import '@fontsource/inter/700.css';

  import '@fontsource/marcellus';
  import Head from '$lib/components/Head.svelte'
</script>

<!-- <Head /> -->

<svelte:head>
  <title>Slice & Dice</title>
  <meta name="description" content="A small experiment that slices &amp; dices messy spreadsheets">
  <meta content="https://f2.phage.directory/sphinx/slicendice-card.png" property="og:image">
  <meta content="https://f2.phage.directory/sphinx/slicendice-card.png" property="og:image:url">
  <link rel="icon" href="/slicendice-sm.png" />
</svelte:head>


<div class="layout | mx-auto container ">
  <slot />
</div>


<style lang="scss" global>
  h1 {
    @apply text-2xl font-bold mb-4 mt-4;
  }
  h2 {
    @apply text-xl font-bold mb-4 mt-8;
  }
  h3 {
    @apply text-lg font-bold mb-4;
  }
  p {
    @apply mb-4;
  }

  a {
    @apply text-blue-500 hover:underline cursor-pointer hover:cursor-pointer;
  }

  pre {
    @apply bg-gray-200 rounded p-4;
  }

  :root {
    // --background: ##FFFBEB;
    // --color-bg: #FFFBEB;
  }

  html, body {
    @apply bg-amber-50;
  }

</style>
