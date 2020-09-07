import axios from 'axios';
import { apiUrl } from '.';

export default {
  async fetch(params) {
    return axios.get(`${apiUrl}/plateaus`, { params });
  },
  async create(params) {
    return axios.post(`${apiUrl}/plateaus`, params);
  },
  async update(id, params) {
    return axios.put(`${apiUrl}/plateaus/${id}`, params);
  },
  async delete(id) {
    return axios.delete(`${apiUrl}/plateaus/${id}`);
  },
  async show(id) {
    return axios.get(`${apiUrl}/plateaus/${id}`);
  },
};
