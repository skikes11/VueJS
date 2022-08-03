import axios from "axios";

const API = axios.create({
// baseURL: process.env.API_URL,
  baseURL: "http://localhost:8000/",
  headers: { "Content-Type": "multipart/form-data"},
  timeout: 10000,
  withCredentials: false,
});

// Todo [+]: Add response/request Handlers

export default API;
