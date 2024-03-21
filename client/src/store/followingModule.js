import axios from "axios";

export default  {
    namespaced: true,
    state() {
        return {
           followRequests: [],
           receivedFollowRequests: [],
           loading: false
        }
    },
    mutations: {
        ADD_FOLLOW_REQUEST(state, request) {
            state.followRequests.push(request);
        },
        SET_FOLLOW_REQUESTS(state, requests) {
            state.followRequests = requests;
        },
        SET_RECEIVED_FOLLOW_REQUESTS(state, requests) {
            state.receivedFollowRequests = requests;
          },
        UPDATE_FOLLOW_REQUEST(state, { requestId, response }) {
            let requestIndex = state.followRequests.findIndex(req => req.id === requestId);
            let receivedRequestIndex = state.receivedFollowRequests.findIndex(req => req.id === requestId);
            if (requestIndex !== -1) {
                state.followRequests = state.followRequests.map((request, index) => 
                    index === requestIndex ? { ...request, status: response } : request
                );
            }
            
            if (receivedRequestIndex !== -1) {
                state.receivedFollowRequests = state.receivedFollowRequests.map((request, index) =>
                    index === receivedRequestIndex ? { ...request, status: response } : request
                );
            }
        },
        SET_LOADING(state, value) {
            state.loading = value;
        },
      },
      
    actions: {
        async sendFollowRequest({ commit }, payload) {
            try {
                const response = await axios.post(`/.netlify/functions/postFollowRequest`, payload);
                if (response.status === 200) {
                    commit('ADD_FOLLOW_REQUEST', response.data);
                }
            } catch (error) {
                console.error(error);
            }
        },
        async unfollowUser({ commit }, payload) {
            try {
                const response = await axios.post(`/.netlify/functions/unfollowUser`, payload);
                if (response.status === 200) {
                    console.log(response.data);
                }
            }catch (error) {
                console.error(error);
            }
        },
        async fetchFollowRequests({ commit }, userId) {
            commit('SET_LOADING', true);
            try {
                const response = await axios.post(`/.netlify/functions/getFollowRequests`, { userId: userId });
                
                if (response.status === 200) {
                    const { sentRequests, receivedRequests } = response.data;
                    commit('SET_FOLLOW_REQUESTS', sentRequests);
                    commit('SET_RECEIVED_FOLLOW_REQUESTS', receivedRequests);
                }
            } catch (error) {
                console.error(error);
            } finally {
                commit('SET_LOADING', false);
            }
        },
        async acceptFollowRequest({ commit }, payload) {
            try {
                const response = await axios.post(`/.netlify/functions/acceptFollowRequest`, payload);
                if (response.status === 200) {
                    commit('UPDATE_FOLLOW_REQUEST', response.data);
                }
            } catch (error) {
                console.error(error);
            }
        },
        async declineFollowRequest({ commit }, payload) {
            try {
                const response = await axios.post(`/.netlify/functions/declineFollowRequest`, payload);
                if (response.status === 200) {
                    commit('UPDATE_FOLLOW_REQUEST', response.data);
                }
            } catch (error) {
                console.error(error);
            }
        },
    },
    getters: {
        specificFollowRequestFromMe: (state) => (currentUserId, userId) => {
            const _ = state.lastUpdated;
            const request =  state.receivedFollowRequests.find(req => 
                req.senderId === userId 
                && req.receiverId === currentUserId
                && req.status === 'pending'
                );
                return request;
        }
    }

}