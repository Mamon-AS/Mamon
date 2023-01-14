import sanityClient from '@sanity/client'

const client = sanityClient({
  projectId: '6d8qgan5',
  dataset: 'production',
  useCdn: true 
})

export default client
