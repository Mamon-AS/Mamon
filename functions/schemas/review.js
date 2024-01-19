export default {
    name: 'review',
    title: 'Review',
    type: 'document',
    fields: [
      {
        name: 'reviewedItem',
        title: 'Reviewed Item',
        type: 'string',
        description: 'Name of the item being reviewed',
        validation: Rule => Rule.required().error('Missing item name')
      },
      {
        name: 'rating',
        title: 'Rating',
        type: 'number',
        description: 'Star rating',
        validation: Rule => Rule.required().min(1).max(5).error('Ratings must be between 1 and 5 stars.')
      },
      {
        name: 'description',
        title: 'Description',
        type: 'string',
        description: 'Description of item being reviewed',
      },
      {
        name: 'userId',
        title: 'User ID',
        type: 'string',
        description: 'ID of the user who wrote the review',
        validation: Rule => Rule.required().error('Missing user ID')
      }, 
      {
        name: 'reviewedImage',
        title: 'Image of Reviewed Item',
        type: 'image',
        description: 'Taken from metadata of the URL or maybe prisjakt, who knows',
      }
    ]
  }
  