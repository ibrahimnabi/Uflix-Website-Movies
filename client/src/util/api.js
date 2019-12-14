import axios from "axios";

const url = "http://localhost:5000";
// const url = "https://pacific-mesa-51787.herokuapp.com";
const api = axios.create({
  baseURL: url
});
const getToken = () => {
  const token = localStorage.getItem("token");

  return JSON.parse(token);
};
const setToken = token => {
  localStorage.setItem("token", JSON.stringify(token));
};

const removeToken = () => {
  localStorage.removeItem("token");
};

const setUser = user => {
  localStorage.setItem("user", JSON.stringify(user));
};
const getUser = () => {
  const user = localStorage.getItem("user");
  return JSON.parse(user);
};

const removeUser = () => {
  localStorage.removeItem("user");
};

const catagories = [
  "Select",
  "Action",
  "Adventure",
  "Comedy",
  "Crime",
  "Drama",
  "Fantasy",
  "Historical",
  "Historical fiction",
  "Horror",
  "Magical realism",
  "Mystery",
  "Paranoid Fiction",
  "Philosophical",
  "Political",
  "Romance",
  "Saga",
  "Satire",
  "Science Fiction",
  "Social",
  "Speculative",
  "Thriller",
  "Urban",
  "Western",
  "Animation"
];

const topCatagories = [
  "Adventure",
  "Thriller",
  "Horror",
  "Comedy",
  "Romance",
  "Drama"
];

export {
  catagories,
  api,
  getToken,
  getUser,
  setToken,
  setUser,
  removeToken,
  url,
  removeUser
};
