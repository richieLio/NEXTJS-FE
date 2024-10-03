import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5139/api',
});

// Define an interface for the error response object
interface ErrorResponse {
  data?: any;
  status?: number;
  headers?: any;
}

// Add a request interceptor to include the token in headers
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for handling errors
instance.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    const res: ErrorResponse = {};
    if (error.response) {
      res.data = error.response.data;
      res.status = error.response.status;
      res.headers = error.response.headers;
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log('Error', error.message);
    }
    return res;
  }
);

export default instance;
