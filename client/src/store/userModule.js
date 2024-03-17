import axios from 'axios';

export default {
    namespaced: true,
    state() {
        return {
           userItems: [],
           isLoading: false,
           error: null,
           isPrivate: false,
           notifications: [],
        }
    },
    mutations: {
		SET_USERS(state, userItems) {
            state.userItems = userItems;
        },	
        SET_LOADING(state, isLoading) {
            state.isLoading = isLoading;
        },
        SET_ERROR(state, error) {
            state.error = error;
        },
        SET_PRIVACY(state, isPrivate) {
            state.isPrivate = isPrivate;
        },
        SET_NOTIFICATION(state, notification) {
            state.notifications.push(notification);
        },
        REMOVE_NOTIFICATION(state, notificationId) {
        state.notifications = state.notifications.filter(notification => notification.id !== notificationId);
        }
    },
	actions: { 
        async fetchUsers( { commit },  userId) {
            commit('SET_LOADING', true); 
            commit('SET_ERROR', null); 
            try {
                const response = await axios.post(`/.netlify/functions/getUserData`,   userId  );
                if (response.status === 200) {
                    commit('SET_USERS', response.data);
                    commit('SET_LOADING', false);
                }
            } catch (error) {
                console.error(error);
                commit('SET_ERROR', error);
                commit('SET_LOADING', false);
                
            }
        },
        async togglePrivacy( { commit },  { userId:userId}) {
            commit('SET_LOADING', true); 
            commit('SET_ERROR', null); 
            try {
                const response = await axios.post(`/.netlify/functions/postPrivacy`, userId  );
                if (response.status === 200) {
                    const responseData = response.data; 
                    commit('SET_PRIVACY', responseData.isPrivate);
                    commit('SET_LOADING', false);
                }else {
                    throw new Error('Failed to update privacy setting');
                }
            } catch (error) {
                console.error(error);
                commit('SET_ERROR', error);
                commit('SET_LOADING', false);
                
            }
        },
        async fetchPrivacySetting({ commit }, userId) {
            commit('SET_LOADING', true);
            try {
              const response = await axios.post(`/.netlify/functions/getPrivacy`, userId );
              commit('SET_LOADING', false);
              if (response.status === 200 && response.data) {
                const responseData = response.data; 
                commit('SET_PRIVACY', responseData.isPrivate);
                return response.data.isPrivate;
              }
            } catch (error) {
              console.error('Error fetching privacy setting:', error);
              commit('SET_ERROR', error);
              commit('SET_LOADING', false);
            }
        },
         async markNotificationAsRead ({ commit },  notificationId ) {
            commit('SET_LOADING', true);
            try {
                const response = await axios.post(`/.netlify/functions/markNotificationAsRead`, notificationId);
                commit('SET_LOADING', false);
                if (response.status === 200) {
                    commit('REMOVE_NOTIFICATION', notificationId);
                }
            } catch (error) {
                console.error('Error marking notification as read:', error);
                commit('SET_ERROR', error);
                commit('SET_LOADING', false);
                }
            },

    },
    

}