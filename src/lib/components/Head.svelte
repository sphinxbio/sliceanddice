
<script>
  import { page } from '$app/stores';
  import SvelteSeo from 'svelte-seo'
  export const twitter = {};

  export let title=null, description=null, ogUrl=null
  let {head} = $page?.data;

  // console.log('head.svelte:', title, head)
</script>

<SvelteSeo
  title={title ? `${head?.title} | ${title}` : head?.title || ''}
  description={description || head?.description || ''}
  keywords={head?.keywords || ''}
  canonical={head?.canonical || ''}
  openGraph={{
      ...head?.openGraph,
      url: ogUrl || head?.url || '',
      // type: article ? siteSeoOpenGraphArticle.type : siteSeoOpenGraphBase.type,
      // ...(article ? { article: {...siteSeoOpenGraphArticle.article, ...article} } : null) }}
  }}
  twitter={{ ...head?.twitter}}
/>

<svelte:head>
	{#if head }
		{#if head?.meta}
			{#each head?.meta as meta}
				<meta 
					charset={meta?.charset}
					data-hid={meta?.hid} 
					name={meta?.name} 
					content={meta?.content} 
					property={meta?.property} 
				>
			{/each}
    {/if}
		{#if head?.links}
			{#each head?.links as link}
				<link data-hid={link?.hid} rel={link?.rel} href={link?.href} crossorigin={link?.crossorigin ? 'crossorigin' : ''}>
			{/each}
		{/if}
	{/if}
</svelte:head>

<!-- <h2>Main Head</h2> -->