import Vuex from 'vuex';
import Vue from 'vue';
import moduleSocket from './modules/socket';
Vue.use(Vuex);

const createStore = () => {
  return new Vuex.Store({
    modules: {
      moduleSocket,
    },
    strict: false,
  });
};

export default createStore;
