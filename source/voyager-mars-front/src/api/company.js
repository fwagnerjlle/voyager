import axios from 'axios';
import { apiUrl } from '.';

export default {
  async fetch(params) {
    return axios.get(`${apiUrl}/companies`, { params });
  },
  async create(params) {
    return axios.post(`${apiUrl}/companies`, params);
  },
  async update(id, params) {
    return axios.put(`${apiUrl}/companies/${id}`, params);
  },
  async delete(id) {
    return axios.delete(`${apiUrl}/companies/${id}`);
  },
  async show(id) {
    return axios.get(`${apiUrl}/companies/${id}`);
  },
  async qualquerCoisa() {
    return axios.get(`${apiUrl}/companies/qualquerCoisa`);
  },
};
