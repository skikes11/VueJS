import axios from "axios";

const api = axios.create({
  baseURL: process.env.VUE_APP_URL+'/',
  headers: { 'Content-Type': 'application/json', },
  timeout: 10000,
  withCredentials: false,
});




// Todo [+]: Add response/request Handlers

export default api
