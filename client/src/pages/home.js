import React from "react";
import Slide from "../components/slide/slide";
import Carousel from "../components/carousel/carousel";
// import { catagories } from "../util/api";
import "./home.css";
export default class Home extends React.Component {
  render() {
    // const slides = catagories.map((data, idx) => {
    //   return <Slide title={data} movies={this.props.movies} />;
    // });
    return (
      <div className="home">
        {this.props.movies.length && (
          <Carousel
            movie={this.props.movies}
            favouriteHandler={this.props.favouriteHandler}
          />
        )}
        <div className="section">
          <Slide
            title={"Recent Movies"}
            movies={this.props.movies}
            favouriteHandler={this.props.favouriteHandler}
          />
        </div>
      </div>
    );
  }
}
