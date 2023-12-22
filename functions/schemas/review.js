export default {
    name: 'review',
    title: 'Review',
    type: 'document',
    fields: [
      {
        name: 'reviewedItem',
        title: 'Reviewed Item',
        type: 'string',
        description: 'Name of the item being reviewed'
      },
      {
        name: 'rating',
        title: 'Rating',
        type: 'number',
        description: 'Star rating',
        validation: Rule => Rule.required().min(1).max(5).error('Ratings must be between 1 and 5 stars.')
      },
      {
        name: 'userId',
        title: 'User ID',
        type: 'string',
        description: 'ID of the user who wrote the review'
      }
    ]
  }
  