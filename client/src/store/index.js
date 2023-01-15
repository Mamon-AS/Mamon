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
			console.log("marketing")
			console.log(marketing)
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
		}
	},

	getters: {
		marketing: state => state.marketing.sort((a,b) => new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime()
		)
	}
		
})