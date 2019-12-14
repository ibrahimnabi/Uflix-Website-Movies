import React from "react";
import GridSlide from "../components/grid-slide/grid-slide";
import Slide from "../components/slide/slide";
import { catagories } from "../util/api";
import "./grid.css";
export default class Grid extends React.Component {
  state = {
    filter: ""
  };

  change = e => {
    this.setState(
      {
        [e.target.name]: e.target.value
      },
      () => {
        console.log(this.state);
      }
    );
  };

  getGenreFilter = (movies, filter) => {
    if (!this.state.filter) return movies;
    return movies.filter(m => {
      const genre = m.genre.map(g => g.trim());
      console.log(genre);
      return genre.includes(filter);
    });
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.navbar.current.style.position = "relative";
  }

  componentWillUnmount() {
    this.props.navbar.current.style.position = "fixed";
  }
  render() {
    const customCatagories = catagories.map(catagory => (
      <option value={catagory == "Select" ? "" : catagory}>{catagory}</option>
    ));
    return (
      <div className="grid">
        <div className="header">
          <h1 className="title">{this.props.name}</h1>
          <select className="catagories" name="filter" onChange={this.change}>
            {customCatagories}
          </select>
        </div>
        <div className="section">
          <GridSlide
            movies={this.getGenreFilter(this.props.movies, this.state.filter)}
            favouriteHandler={this.props.favouriteHandler}
          />
        </div>
      </div>
    );
  }
}
