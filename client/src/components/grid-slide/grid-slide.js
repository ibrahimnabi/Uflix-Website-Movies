import React from "react";
import Card from "../card/card";
import "./grid-slide.css";
import Modal from "../modal/modal";

export default class GridSlide extends React.Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.state = {
      selected: false,
      movie: null
    };
  }

  openModal = (e, movie) => {
    this.setState({ movie: movie, selected: true }, () => {
      this.modal.current.style.height = "80vh";
      this.modal.current.style.width = "100%";
      this.modal.current.style.opacity = "1";
    });
  };
  closeModal = e => {
    this.modal.current.style.height = "0px";
    this.modal.current.style.width = "0px";
    this.modal.current.style.opacity = "0";
    this.setState({ movie: null, selected: false });
  };
  render() {
    const { title, movies } = this.props;
    const moviesCard = movies.map((movie, idx) => {
      return (
        <Card
          key={"" + idx}
          movie={movie}
          openModal={e => this.openModal(e, movie)}
          favouriteHandler={this.props.favouriteHandler}
        />
      );
    });

    return (
      <div className="grid-slide">
        <p>{title}</p>
        <div className="cards">{moviesCard}</div>
        {this.state.selected ? (
          <Modal
            context={this.modal}
            closeModal={this.closeModal}
            movie={this.state.movie}
          />
        ) : null}
      </div>
    );
  }
}
