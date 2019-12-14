import React from "react";
import CustomButton from "../components/button/button";
import TextInput from "../components/textInput/textInput";
import CockPit from "../components/cockpit/cockpit";
import { api, getUser, getToken } from "../util/api";

import "./demandMovies.css";

export default class Demand extends React.Component {
  state = {
    titleSuggestion: "",
    review: ""
  };
  change = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  submit = () => {
    const { titleSuggestion, review } = this.state;
    const { _id } = getUser();
    const token = getToken();
    api
      .post(
        "/user/demand/" + _id,
        { titles: [titleSuggestion], review },
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
      <div className="demand-movies">
        <CockPit>
          <p>Want to watch your favourte TV Show or Movie on demand?</p>
          <p> Please send us request.</p>
          <form>
            <TextInput
              change={this.change}
              value={this.state.titleSuggestion}
              name="titleSuggestion"
              type="text"
              placeholder="Title Suggestion"
            />
            <textarea
              onChange={this.change}
              value={this.state.review}
              name="review"
              rows="5"
              placeholder="Your review here..."
            ></textarea>
            <CustomButton name={"Submit Request"} submit={this.submit} />
          </form>
        </CockPit>
      </div>
    );
  }
}
