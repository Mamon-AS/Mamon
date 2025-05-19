export default {
  name: 'howItWorks',
  title: 'Hvordan fungerer det',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Tittel',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'sections',
      title: 'Seksjoner',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Tittel',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'description',
              title: 'Beskrivelse',
              type: 'text',
              validation: Rule => Rule.required()
            },
            {
              name: 'image',
              title: 'Bilde',
              type: 'image',
              options: {
                hotspot: true
              }
            },
            {
              name: 'steps',
              title: 'Steg',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {
                      name: 'number',
                      title: 'Nummer',
                      type: 'number',
                      validation: Rule => Rule.required()
                    },
                    {
                      name: 'text',
                      title: 'Tekst',
                      type: 'text',
                      validation: Rule => Rule.required()
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
} 