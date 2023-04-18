import axios from "axios";
const instance = axios.create({
  baseURL: "http://165.22.87.91:3000",
});

export default instance;
