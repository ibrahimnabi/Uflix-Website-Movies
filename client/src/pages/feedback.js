import React from "react";
import CustomButton from "../components/button/button";
import TextInput from "../components/textInput/textInput";
import CockPit from "../components/cockpit/cockpit";
import Rating from "../components/rating/rating";
import { api, getUser, getToken } from "../util/api";
import "./feedback.css";

export default class Feedback extends React.Component {
  state = {
    ratings: 1,
    title: "",
    review: ""
  };
  change = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  selectRatings = ratings => {
    this.setState({
      ratings
    });
  };
  submit = () => {
    const { ratings, title, review } = this.state;
    const { _id } = getUser();
    const token = getToken();
    api
      .post(
        "/user/feedback/" + _id,
        { ratings, title, review },
        { headers: { authorization: token } }
      )
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
  };
  render() {
    return (
      <div className="feedback">
        <CockPit>
          <ion-icon name="thumbs-up"></ion-icon>
          <Rating selectRatings={this.selectRatings} />
          <form>
            <TextInput
              change={this.change}
              value={this.state.title}
              name="title"
              type="text"
              placeholder="Ttile of your review"
            />
            <textarea
              value={this.state.review}
              name="review"
              onChange={this.change}
              rows="5"
              placeholder="Your review here..."
            ></textarea>
            <CustomButton submit={this.submit} name={"Post your review"} />
          </form>
        </CockPit>
      </div>
    );
  }
}
