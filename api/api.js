import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const api = axios.create({
  baseURL: 'http://192.168.31.89:3000',
  timeout: 15000,
});

api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('token');

    // console.log('🔑 TOKEN FROM STORAGE 👉', token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // console.log(
    //   '📡 API REQUEST 👉',
    //   config.method?.toUpperCase(),
    //   config.url,
    //   config.data || ''
    // );

    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  response => {
    // console.log(
    //   '✅ API RESPONSE 👉',
    //   response.config.url,
    //   response.data
    // );
    return response;
  },
  error => {
    // console.log(
    //   '❌ API ERROR 👉',
    //   error.response?.config?.url,
    //   error.response?.data || error.message
    // );
    return Promise.reject(error);
  }
);

export default api;
