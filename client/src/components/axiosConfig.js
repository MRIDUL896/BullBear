import axios from 'axios';

//https://bullbear-backend.onrender.com/
//http://localhost:5000
const api = axios.create({
  baseURL: 'https://bullbear-backend.onrender.com',
  withCredentials: true // This is important for sending cookies with requests
});

export default api;