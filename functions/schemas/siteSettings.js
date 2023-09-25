export default {
	title: 'Site Settings',
	name: 'siteSettings',
	type: 'document',
	fields: [
        {
            name: 'siteTitle',
            type: 'string',
            title: 'Site Title',
        },
        {
            name: 'fullHero',
            type: 'boolean',
            title: 'Full hero',
            description: 'Should the full hero be activated on the homepage?'
        },
        {
            name: 'heroImage',
            type: 'image',
            title: 'Hero image',
            hidden: ({document}) => !document?.fullHero
        },
        {
            name: 'heroTitle',
            type: 'string',
            title: 'Hero title',
            hidden: ({document}) => !document?.fullHero
        },
        {
            name: 'heroText',
            type: 'string',
            title: 'Hero text',
            hidden: ({document}) => !document?.fullHero
        },
        {
            name: 'heroButtonBool',
            type: 'boolean',
            title: 'Hero button check',
            description: 'Should the hero contain a button?',
            hidden: ({document}) => !document?.fullHero
        },
        {
            name: 'heroButtonLink',
            type: 'string',
            title: 'Hero button link',
            hidden: ({document}) => !document?.heroButtonBool
        },
        {
            name: 'heroButtonText',
            type: 'string',
            title: 'Hero button text',
            hidden: ({document}) => !document?.heroButtonBool 
        },
	]
}