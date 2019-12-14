import React from "react";
import Slide from "../components/slide/slide";
import { api, url } from "../util/api";

export default class Movies extends React.Component {
  state = {
    movies: []
  };

  componentDidMount = async () => {
    const response = await api.get("/user/movies");
    const movies = response.data.movies.map(
      ({ _id, cast, description, genre, image, title }) => {
        return {
          _id,
          cast,
          description,
          genre,
          imgLink: url + "/" + encodeURIComponent(image).replace("%5C", "/"),
          title
        };
      }
    );
    this.setState({
      movies
    });
  };
  render() {
    return (
      <div className="movies">
        <Slide title={"Top Rated"} movies={this.state.movies} />
        <Slide title={"Recommended"} movies={this.state.movies} />
      </div>
    );
  }
}
