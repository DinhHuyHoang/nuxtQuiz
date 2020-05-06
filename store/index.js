import Vuex from 'vuex';
import moduleSocket from './modules/socket';

const createStore = () => {
  return new Vuex.Store({
    modules: {
      moduleSocket
    },
    strict: false
  });
};

export default createStore;
