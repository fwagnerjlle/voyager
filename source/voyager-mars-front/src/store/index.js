import Vue from 'vue';
import Vuex from 'vuex';
import isEmpty from 'lodash/isEmpty';
import isArray from 'lodash/isArray';
import axios from 'axios';
import Util from '@/plugins/util';

Vue.use(Vuex);

const modules = Util.getJsModules(require.context('.', false, /\.js$/));

const store = new Vuex.Store({
  state: {
    isLoading: false,
    isError: false,
    isMessage: false,
    errors: {},
    message: {},
    changePass: false,
    modalTicket: false,
    windowWidth: 0,
    windowHeight: 0,
    less600: false,
    less768: false,
    less1124: false,
  },
  modules,
  actions: {
    setLoading: ({ commit }, v) => {
      commit('LOADING', v);
    },
    setError: ({ commit }, v) => {
      commit('ERROR', v);
    },
  },

  mutations: {
    LOADING(state, val) {
      state.isLoading = val;
    },
    ERROR(state, err) {
      state.errors = err;
      state.isError = !isEmpty(state.errors);
    },
    SET_MESSAGE(state, msg) {
      if (isArray(msg)) {
        const messages = msg.map(m => m.message);
        state.message = { msg: messages.join(', ') };
        state.isMessage = !isEmpty(state.message.msg);
      } else {
        if (msg && msg.error) {
          state.message = { msg: msg.error.message, type: msg.type, params: msg.params };
        } else {
          const message = msg && (msg.msg || msg.message || msg);
          state.message = {
            msg: (message || 'Unexpected error'),
            type: (msg && msg.type) || '',
            params: (msg && msg.params) || {},
          };
        }
        state.isMessage = !isEmpty(state.message.msg);
      }
    },
    SET_AUTHORIZATION_TOKEN(state, token) {
      if (!isEmpty(token)) axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      else delete axios.defaults.headers.common.Authorization;
    },
    WINDOW_SIZE(state, size) {
      const { width, height } = size;
      state.windowWidth = width;
      state.windowHeight = height;
      state.less600 = (width < 768);
      state.less768 = (width === 768 && width < 1124);
      state.less1124 = (width >= 1124);
    },
  },
});

export default store;
