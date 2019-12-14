import axios from "axios";
import { loadProgressBar } from "axios-progress-bar";

const BASE_URL = "http://localhost:5000/";
// const BASE_URL = "https://pacific-mesa-51787.herokuapp.com/";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { authorization: "" }
});

api.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

const ourLoad = () => {
  loadProgressBar(null, api);
};

const getToken = () => {
  return JSON.parse(localStorage.getItem("token"));
};

const getRole = () => {
  return JSON.parse(localStorage.getItem("role"));
};
const getRating = async query => {
  const response = await axios.get(
    "https://www.omdbapi.com/?t=" +
      encodeURIComponent(query) +
      "&apikey=5873c6cf"
  );
  return response.data.imdbRating;
};

export { api, getToken, ourLoad, getRating, BASE_URL, getRole };
