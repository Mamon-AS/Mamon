export default {
    namespaced: true,
    state() {
        return {
			modalIsActive: false,
        }
    },
	mutations: {
		SET_MODAL_ACTIVE(state, isActive) {
		  console.log("Setting modal active state to", isActive);
		  state.modalIsActive = isActive;
		}
	  },
	  actions: {
		openModal({ commit }) {
		  commit('SET_MODAL_ACTIVE', true);
		},
		closeModal({ commit }) {
		  commit('SET_MODAL_ACTIVE', false);
		},
		toggleModal({ commit, state }) {
		  commit('SET_MODAL_ACTIVE', !state.modalIsActive);
		}
	  },
	  getters: {
		modalIsActive: (state) => state.modalIsActive
	  }
	};