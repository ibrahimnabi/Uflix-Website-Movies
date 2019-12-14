import React from "react";
import "./modal.css";
import { url } from "../../util/api";
import { Link } from "react-router-dom";

export default function modal({ closeModal, context, movie }) {
  const { title, imgLink, description, genre, cast, rating, artwork } = movie;

  return (
    <div ref={context} className="modal" onDoubleClick={closeModal}>
      <div
        className="cover"
        style={{
          background: `url(${imgLink})`,
          backgroundRepeat: "none",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      ></div>
      <div className="backdrop"></div>
      <div className="content">
        <div className="text">
          <img
            className="movie-logo"
            alt="movie-title"
            src={url + "/" + artwork}
          ></img>
          <p className="secondary">{description}</p>
        </div>
        <div className="modal-controls-btn">
          <div>
            <ion-icon name="play"></ion-icon>
            <Link>Play</Link>
          </div>
          <div>
            <ion-icon name="heart"></ion-icon>
            <Link>Favourite</Link>
          </div>
        </div>
        <div className="list">
          <span>Rating: </span> {rating + "/10"}
        </div>
        <div className="list">
          <span>Starring: </span> {cast.join(",")}
        </div>
        <div className="list">
          <span>Genre: </span> {genre.join(",")}
        </div>
      </div>
      <ion-icon name="close" onClick={closeModal}></ion-icon>
    </div>
  );
}
