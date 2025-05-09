import axios from 'axios';

export const api = axios.create({
    baseURL:import.meta.env.VITE_SERVER_URL,
    headers: {
      "Content-type": "application/json",
    },
    withCredentials: true, 
  });
  