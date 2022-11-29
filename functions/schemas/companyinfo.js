export default {
    name: 'companyinfo',
    type: 'object',
      title: 'Company info',
    fields: [
      {
        name: 'name',
        type: 'string',
        title: 'Company name'
      },
      {
        name: 'slogan',
        type: 'string',
        title: 'Company slogan'
      },
      {
        name: 'logo',
        type: 'image',
        title: 'Company logo'
      },
      {
        name: 'email',
        type: 'string',
        title: 'Company email'
      },
    ]
  }