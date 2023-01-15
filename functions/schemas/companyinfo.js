export default {
    name: 'companyinfo',
    type: 'object',
    title: 'Company info',
    fields: [
      {
        name: 'name',
        type: 'string',
        title: 'Company name',
        validation: Rule => [
          Rule.required().error("Company name must be at least *something*.."),
          Rule.required().max(50).warning("It is recommended to keep the name short.")
        ]
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