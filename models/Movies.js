const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const MovieSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  userRating: {
    type: Number,
    default: 0.0
  },
  usersWhoRated: {
    type: [],
    default: []
  },
  type: {
    type: String,
    required: true
  },
  video: {
    type: [],
    required: true
  },
  language: {
    type: [],
    required: true
  },
  genre: {
    type: [],
    required: true
  },
  cast: {
    type: [],
    required: true
  },
  image: {
    type: String,
    required: true
  },
  trailer: {
    type: String,
    required: true
  },
  artwork: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    default: 0.0
  },
  uploadedAt: {
    type: Date,
    default: Date.now()
  }
});

module.exports = Movie = mongoose.model("movies", MovieSchema);
