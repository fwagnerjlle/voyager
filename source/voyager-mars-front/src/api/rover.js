import axios from 'axios';
import { apiUrl } from '.';

export default {
  async fetch(params) {
    return axios.get(`${apiUrl}/rovers`, { params });
  },
  async create(params) {
    return axios.post(`${apiUrl}/rovers`, params);
  },
  async update(id, params) {
    return axios.put(`${apiUrl}/rovers/${id}`, params);
  },
  async delete(id) {
    return axios.delete(`${apiUrl}/rovers/${id}`);
  },
  async show(id) {
    return axios.get(`${apiUrl}/rovers/${id}`);
  },
  async move(id, params) {
    return axios.put(`${apiUrl}/rovers/move/${id}`, params);
  },
};
