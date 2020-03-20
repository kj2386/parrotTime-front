import axios from 'axios';
import { addToCartUrl } from './constants';

export const authAxios = axios.create({
  baseURL: addToCartUrl, 
  headers: {
    Authorization: `Token ${localStorage.getItem('token')}`
  }
});
