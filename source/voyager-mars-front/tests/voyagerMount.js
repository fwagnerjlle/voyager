import Vue from 'vue';
import Vuetify from 'vuetify';
import moment from 'moment';
import { mount, createLocalVue } from '@vue/test-utils';

Vue.use(Vuetify);

Object.defineProperty(Vue.prototype, '$moment', { value: moment });

const localVue = createLocalVue();

function mountTest(name, props) {
  return mount(name, {
    ...props,
    localVue,
    vuetify: new Vuetify(),
    sync: false,
  });
}

module.exports = {
  mount: mountTest,
  moment,
};
