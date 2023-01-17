export default {
    name: 'marketing',
    type: 'document',
    title: 'Marketing',
    fields: [
      {
        name: 'title',
        type: 'string',
        title: 'Title',
        validation: Rule => [
          Rule.required().error("Missing title"),
          Rule.required().max(50).warning("It is recommended to keep the name short.")
        ]
      },
      {
        name: 'excerpt',
        type: 'text',
        title: 'Excerpt',
        validation: Rule => [
          Rule.required().max(150).warning("It's getting a bit long, isn't it?")
        ]
      },
      {
        name: 'image',
        type: 'image',
        title: 'Image',
        validation: Rule => [
          Rule.required().error("Missing logo/image")
        ]
      },
      {
        name: 'body',
        type: 'text',
        title: 'Body'
      },
    ]
  }