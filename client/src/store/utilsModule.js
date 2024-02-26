export default {
    namespaced: true,
    state() {
        return {
            menu_is_active: false,
        }
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
		},
		CloseMenu ({ commit }) {
			commit('TOGGLE_MENU', 'close')
		},
    },
}