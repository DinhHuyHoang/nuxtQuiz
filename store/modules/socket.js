const state = () => ({
  socket: null,
});

const mutations = {
  SET_SOCKET(state, payload) {
    state.socket = payload.socket;
  },
};

const actions = {
  initializeSocket({ commit }, payload) {
    commit('SET_SOCKET', payload);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
