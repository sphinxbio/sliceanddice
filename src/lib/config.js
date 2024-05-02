

import { writable, get } from 'svelte/store';


/**
 * All of these values are used throughout the site – for example, 
 * in the <meta> tags, in the footer, and in the RSS feed.
 * 
 * PLEASE BE SURE TO UPDATE THEM ALL! Thank you!
 **/

export const siteIcon = "/favicon.png"
export const siteCardTitle = "Slice and Dice"
export const siteTitle = siteCardTitle
export const siteDescription = "A small experiment that slices & dices messy spreadsheets"
export const siteURL = "sliceanddice.vercel.app" // no protocol
export const siteLink = "https://" + siteURL // 'https://github.com/josh-collinsworth/sveltekit-blog-starter'
export const siteCard = "https://sliceanddice.vercel.app/slicendice-card.png"
export const siteAuthor = 'Jan Zheng'
export const siteTwitter = '@yawnxyz'

// Controls how many posts are shown per page on the main blog index pages
export const postsPerPage = 10

// Edit this to alter the main nav menu. (Also used by the footer and mobile nav.)
export const navItems = [
  // {
  //   title: 'Blog',
  //   route: '/blog'
  // }, {
  //   title: 'About',
  //   route: '/about'
  // }, {
  //   title: 'Contact',
  //   route: '/contact'
  // },
]




// prev: headMatter
// this uses svelte-seo schema
export let head = {
  baseUrl: siteURL,
  title: siteTitle,
  description: siteDescription,
  url: siteURL,
  // canonical: import.meta.env ? import.meta.env.VITE_SITE_URL : 'https://www.example.com', // breaks on vercel
  canonical: siteLink,
  // tags: ["Tag A"]
  pageName: '',
  color: '#5432CA',
  twitter: siteTwitter,
  author: siteAuthor,
  ico: siteIcon,
  image: {
    url: siteCard,
    width: 850,
    height: 650,
    alt: siteCardTitle,
  },
  meta: [
    { property: "og:image:url", content: siteCard },
    { property: "og:image", content: siteCard },
    // { hid: 'google-site-verification', name: 'google-site-verification', content: "FV3L35TjM9haadbuZvHLDz2n-I1KUbN_gYqM3cIH0Wk" },
  ],
}
head = {
  ...head,
  links: [
    { rel: 'icon', type: 'image/png', href: siteIcon }, // <link rel="icon" sizes="192x192" href="/path/to/icon.png">
    { rel: 'apple-touch-icon', href: siteIcon }, // default resolution is 192x192 <link rel="apple-touch-icon" href="/path/to/apple-touch-icon.png">
    { rel: 'mask-icon', href: siteIcon, color: head.color }, // <link rel="mask-icon" href="/path/to/icon.svg" color="blue"> <!-- Safari Pinned Tab Icon -->
    // { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    // { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
    // { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@700&display=swap' },
  ]
}


export const Head = writable(head)

export const seo = {
  openGraph: {
    title: head.title,
    description: head.description,
    type: "website",
    url: head.url,
    // article: {
    //   publishedTime: "2020-08-03T17:31:37Z",
    //   modifiedTime: "2020-08-20T09:31:37Z",
    //   expirationTime: "2025-12-21T17:31:37Z",
    //   section: "Section II",
    //   authors: [
    //     "https://www.example.com/authors/@firstnameA-lastnameA",
    //     "https://www.example.com/authors/@firstnameB-lastnameB",
    //   ],
    //   tags: _head.tags,
    // },
    images: [
      head.image
      // {
      //   url: "https://www.example.com/images/cover.jpg",
      //   width: 850,
      //   height: 650,
      //   alt: "Og Image Alt",
      // },
    ],
  },
  twitter: {
    site: head.twitter,
    title: head.title,
    description: head.description,
    image: head.image.url,
    imageAlt: head.image.alt,
    card: 'summary_large_image'
  }
};


export const setHeadFromPageContent = (pagecontent) => {
  // Head.title = pagecontent['Page Title']
  // $Head.description = pagecontent['Page Description']
  // $Head.image.url = pagecontent['Card']

  // console.log('setting head content', pagecontent)
  if (pagecontent)
    Head.update(n => ({
      ...n,
      title: pagecontent['Page Title'],
      description: pagecontent['Page Description'],
      image: {
        url: pagecontent['Card']
      },
    }))
  // console.log('updated Head', get(Head))
}