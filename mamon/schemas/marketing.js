export default {
    name: 'marketing',
    type: 'document',
      title: 'Marketing',
    fields: [
      {
        name: 'title',
        type: 'string',
        title: 'Title'
      },
      {
        name: 'excerpt',
        type: 'text',
        title: 'Excerpt'
      },
      {
        name: 'image',
        type: 'image',
        title: 'Image'
      },
      {
        name: 'body',
        type: 'text',
        title: 'Body'
      },
    ]
  }