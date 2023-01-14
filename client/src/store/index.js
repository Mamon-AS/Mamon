import { createStore } from 'vuex'

export default createStore({
	state: {
		menu_is_active: false,
		companies: []
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
	},
	
	actions: {
		ToggleMenu ({ commit }) {
			commit('TOGGLE_MENU')
		}
	},

	getters: {
		
	}
		
})