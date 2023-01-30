import { createStore } from 'vuex'

import sanity from '../client'

export default createStore({
	state: {
		menu_is_active: false,
		marketing: [],
		excerpts: []
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
		}
	},
	
	actions: {
		ToggleMenu ({ commit }) {
			commit('TOGGLE_MENU')
		},
		FetchMarketing ({ commit }, limit = null) {
			// const query = `*[_type == "marketing"] ${limit ? `[0...${limit}]` : ''}`
			const query = `*[_type == "marketing"]`
			sanity.fetch(query).then(marketing => {
				commit('SET_MARKETING', marketing)
			})
		},
		UpdateMarketing({ commit }, post) {
			commit('SET_MARKETING', this.state.marketing.map(p => p._id === post._id ? post : p))
		},
		AddNewMarketing({ commit }, post) {
			commit('SET_MARKETING', [...this.state.marketing, post])
		},
		RemoveMarketing ({ commit }, id) {
			commit('SET_MARKETING', this.state.marketing.filter(p => p._id !== id))
		}
	},

	getters: {
		marketing: state => state.marketing.sort((a,b) => new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime()
		)
	}
		
})