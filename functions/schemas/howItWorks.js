export default {
  name: 'howItWorks',
  title: 'Hvordan fungerer det',
  type: 'document',
  fields: [
    {
      name: 'pageTitle',
      title: 'Sidetittel',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'introduction',
      title: 'Introduksjonstekst',
      type: 'text',
      validation: Rule => Rule.required()
    },
    {
      name: 'horizontalCards',
      title: 'Horisontale kort',
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
              name: 'backgroundColor',
              title: 'Bakgrunnsfarge',
              type: 'string',
              options: {
                list: [
                  { title: 'Hvit', value: 'white' },
                  { title: 'Lys blå', value: 'light-blue' },
                  { title: 'Lys grønn', value: 'light-green' }
                ]
              }
            },
            {
              name: 'cta',
              title: 'Call to Action',
              type: 'object',
              fields: [
                {
                  name: 'text',
                  title: 'Tekst',
                  type: 'string'
                },
                {
                  name: 'link',
                  title: 'Lenke',
                  type: 'string'
                }
              ]
            }
          ]
        }
      ]
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