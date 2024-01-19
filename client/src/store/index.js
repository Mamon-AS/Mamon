import { createStore } from 'vuex'

import sanity from '../client'

export default createStore({
	state: {
		menu_is_active: false,
		marketing: [],
		excerpts: [],
		total_marketing: 0,
		authors: [],
		reviewItems: [],
		total_reviews: 0,
	},

	mutations: {
		TOGGLE_MENU (state, dir = null) {
			
			if (dir === 'open') {
				state.menu_is_active = true
			} else if (dir === 'close') {
				state.menu_is_active = false
			} else {
				state.menu_is_active = !state.menu_is_active
			}
		},
		// Posts
		SET_MARKETING (state, marketing) {
			state.marketing = marketing
		},
		SET_TOTAL_MARKETING (state, total_marketing) {
			state.total_marketing = total_marketing
		},
		INCREMENT_TOTAL_MARKETING (state, increment = 1) {
			state.total_marketing += increment
		},
		// Authors
		SET_AUTHORS (state, authors) {
			state.authors = authors
		},
		// Reviews
		SET_REVIEWS (state, reviewItems) {
			state.reviewItems = reviewItems
		},
		SET_TOTAL_REVIEWS (state, total_reviews) {
			state.total_reviews = total_reviews
		},
		INCREMENT_TOTAL_REVIEWS (state, increment = 1) {
			state.total_reviews += increment
		},
	},
	
	actions: { 
		ToggleMenu ({ commit }) {
			commit('TOGGLE_MENU')
		},
		CloseMenu ({ commit }) {
			commit('TOGGLE_MENU', 'close')
		},
		// Posts
		FetchMarketing ({ commit }, limit = null) {
			// const query = `*[_type == "marketing"] ${limit ? `[0...${limit}]` : ''}`
			// (We need the | operator here in front of the order()-function, because sanity
			const query = `*[_type == "marketing"] { ..., author-> } | order(_createdAt desc) ${limit ? `[0...${limit}]` : ''}`
			
			sanity.fetch(query).then(marketing => {
				commit('SET_MARKETING', marketing)
			})

			const count_query = 'count(*[_type == "marketing"])'
			
			sanity.fetch(count_query).then(count => {
				commit('SET_TOTAL_MARKETING', count)
			})
		},
		UpdateMarketing({ commit }, post) {
			commit('SET_MARKETING', this.state.marketing.map(p => p._id === post._id ? post : p))
		
		},
		AddNewMarketing({ commit }, post) {
			commit('SET_MARKETING', [...this.state.marketing, post])
			commit('INCREMENT_TOTAL_MARKETING')
		},
		RemoveMarketing ({ commit }, id) {
			commit('SET_MARKETING', this.state.marketing.filter(p => p._id !== id))
			commit('INCREMENT_TOTAL_MARKETING', -1)
		},
		LoadMoreMarketing ({ commit }, limit = 10)  {
			const query = `*[_type == "marketing"] { ..., author-> } | order(_createdAt desc) [${this.state.marketing.length}...${this.state.marketing.length + limit}]`

			sanity.fetch(query).then(marketing => {
				commit('SET_MARKETING', [...this.state.marketing, ...marketing])
			})
		},
		// Authors
		FetchAuthors({ commit }) {
			const query = `*[_type == "author"] | order(full_name)`

			sanity.fetch(query).then(authors => {
				console.log(authors)
				commit('SET_AUTHORS', authors)
			})
		},
		// Reviews
		FetchReviews ({ commit }, limit = null) {
			const query = `*[_type == "review"] | order(_createdAt desc) ${limit ? `[0...${limit}]` : ''}`

			sanity.fetch(query).then(reviewItems => {
				console.log(reviewItems)
				commit('SET_REVIEWS', reviewItems)
			})

			const count_query = 'count(*[_type == "review"])'
			
			sanity.fetch(count_query).then(count => {
				commit('SET_TOTAL_REVIEWS', count)
			})
		},

		AddNewReviews({ commit }, post) {
			console.log("whipping that money")
			console.log(post)
			commit('SET_REVIEWS', [...this.state.reviewItems, post])
			commit('INCREMENT_TOTAL_REVIEWS')
		},

		RemoveReviews ({ commit }, id) {
			commit('SET_REVIEWS', this.state.reviewItems.filter(p => p._id !== id))
			commit('INCREMENT_TOTAL_REVIEWS', -1)
		},
		LoadReviews ({ commit }, limit = 10)  {
			const query = `*[_type == "review"] | order(_createdAt desc) [${this.state.reviewItems.length}...${this.state.reviewItems.length + limit}]`

			sanity.fetch(query).then(reviewItems => {
				commit('SET_REVIEWS', [...this.state.reviewItems, ...reviewItems])
			})
		},

	},

	getters: {
		marketing: state => state.marketing.sort((a,b) => new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime()
		),
		authors: state => state.authors,
		reviewItems: state => state.reviewItems.sort((a,b) => new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime(),
		),
	}
		
})