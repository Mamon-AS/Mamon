import sanityClient from '@sanity/client'

const sanity = sanityClient({
    projectId: '6d8qgan5',
    dataset: 'production',
    useCdn: true,
    apiVersion: '2021-03-25',
    token: process.env.VITE_SANITY_TOKEN
  })

export default sanity
