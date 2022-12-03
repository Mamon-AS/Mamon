export default {
    name: 'header',
    type: 'document',
      title: 'Site header',
    fields: [
      {
        type: 'array',
        name: 'menu',
        title: 'Menu',
        of: [
          {
            name: 'companyinfo',
            type: 'companyinfo',
            title: 'Company info'
          }
        ]
      }
    ]
  }