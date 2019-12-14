import React from "react";
import "./rating.css";
import { ReactComponent as Star } from "../../images/star.svg";
import { ReactComponent as StarOutline } from "../../images/star-outline.svg";
export default class rating extends React.Component {
  state = {
    stars: ["Star", "StarOutline", "StarOutline", "StarOutline", "StarOutline"]
  };

  onClick = (e, element, idx) => {
    console.log("clicked");
    let rerender = [
      "Star",
      "StarOutline",
      "StarOutline",
      "StarOutline",
      "StarOutline"
    ];
    rerender.fill("Star", 0, idx + 1);
    this.setState({ stars: rerender }, () => {
      this.props.selectRatings(idx + 1);
    });
  };

  render() {
    let renderedStars = this.state.stars.map((element, idx) => {
      return element === "Star" ? (
        <Star onClick={e => this.onClick(e, element, idx)} />
      ) : (
        <StarOutline onClick={e => this.onClick(e, element, idx)} />
      );
    });
    return <div className="rating">{renderedStars}</div>;
  }
}
