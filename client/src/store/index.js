import { createStore } from 'vuex'

import sanity from '../client'

export default createStore({
	state: {
		menu_is_active: false,
		marketing: [],
		excerpts: [],
		total_marketing: 0
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
		SET_MARKETING (state, marketing) {
			state.marketing = marketing
		},
		SET_TOTAL_MARKETING (state, total_marketing) {
			state.total_marketing = total_marketing
		},
		INCREMENT_TOTAL_MARKETING (state, increment = 1) {
			state.total_marketing += increment
		}
	},
	
	actions: { 
		ToggleMenu ({ commit }) {
			commit('TOGGLE_MENU')
		},
		FetchMarketing ({ commit }, limit = null) {
			// const query = `*[_type == "marketing"] ${limit ? `[0...${limit}]` : ''}`
			// (We need the | operator here in front of the order()-function, because sanity
			const query = `*[_type == "marketing" ] | order(_createdAt desc) ${limit ? `[0...${limit}]` : ''}`
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
			const query = `*[_type == "marketing"] | order(_createdAt desc) [${this.state.marketing.length}...${this.state.marketing.length + limit}]`

			sanity.fetch(query).then(marketing => {
				commit('SET_MARKETING', [...this.state.marketing, ...marketing])
			})
		}
	},

	getters: {
		marketing: state => state.marketing.sort((a,b) => new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime()
		)
	}
		
})