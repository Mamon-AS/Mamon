export default {
    namespaced: true,
    state() {
        return {
            menu_is_active: false,
        }
    },
    mutations: {
		TOGGLE_MENU (state, dir = null) {
			console.log("TOGGLE_MENU MUTATION CALLED");
			if (dir === 'open') {
				console.log("OPEN MENU");
				state.menu_is_active = true
			} else if (dir === 'close') {
				console.log("CLOSED MENU");
				state.menu_is_active = false
			} else {
				console.log("IDK WHATS GOING ON");
				state.menu_is_active = !state.menu_is_active
				console.log("STATE MENU IS ACTIVE", state.menu_is_active);
			}
		},
    },	
	actions: { 
		ToggleMenu ({ commit }) {
			console.log("IM GOING TO COMMIT TOGGLE MENU");
			commit('TOGGLE_MENU')
		},
		CloseMenu ({ commit }) {
			console.log("IM GOING TO COMMIT CLOSE MENU");
			commit('TOGGLE_MENU', 'close')
		},
    },
}