import React from "react";
import "./carousel.css";
import { Link } from "react-router-dom";
import { url } from "../../util/api";

export default class Carousel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      video: null,
      favourite: false
    };
  }

  render() {
    return (
      <div className="carousel">
        <video
          autoPlay
          loop
          muted
          src={
            url + "/" + this.props.movie[this.props.movie.length - 1].trailer
          }
          className="carousel-video"
        ></video>
        <div className="carousel-controls">
          <div className="text">
            <img
              className="movie-logo"
              alt="movie-title"
              src={
                url +
                "/" +
                this.props.movie[this.props.movie.length - 1].artwork
              }
            ></img>
            <p className="movie-description">
              {this.props.movie[this.props.movie.length - 1].description}
            </p>
          </div>
          <div className="carousel-controls-btn">
            <div>
              <ion-icon name="play"></ion-icon>
              <Link
                to={{
                  pathname: "/movie",
                  state: {
                    movie: this.props.movie[this.props.movie.length - 1]
                  }
                }}
              >
                Play
              </Link>
            </div>
            <div
              onClick={e =>
                this.props.favouriteHandler(
                  e,
                  this.props.movie[this.props.movie.length - 1]
                )
              }
            >
              {this.props.movie[this.props.movie.length - 1].isFav ? (
                <ion-icon name="heart"></ion-icon>
              ) : (
                <ion-icon name="heart-empty"></ion-icon>
              )}
              <Link>Favourite</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
