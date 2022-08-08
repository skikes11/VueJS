import axios from "axios";

const API = axios.create({
  baseURL: process.env.VUE_APP_URL+'/',
  headers: { 'Content-Type': `multipart/form-data`, },
  timeout: 10000,
  withCredentials: false,
});



// Todo [+]: Add response/request Handlers

export default API;
