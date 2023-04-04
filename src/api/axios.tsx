import axios from 'axios';
import { SERVER_URI } from '../CONSTANTS';

export default axios.create({
  baseURL: SERVER_URI
});

export const axiosPrivate = axios.create({
  baseURL: SERVER_URI,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});