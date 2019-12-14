import React from "react";
import CustomButton from "../components/button/button";
import TextInput from "../components/textInput/textInput";
import CockPit from "../components/cockpit/cockpit";
import { api, getUser, getToken } from "../util/api";
import "./support.css";

export default class support extends React.Component {
  state = {
    phone: "",
    subject: "",
    query: ""
  };
  change = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  submit = () => {
    const { subject, phone, query } = this.state;
    const { _id } = getUser();
    const token = getToken();
    api
      .post(
        "/user/support/" + _id,
        { subject, phone, query },
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
      <div className="support">
        <CockPit>
          <ion-icon name="quote"></ion-icon>
          <form>
            <TextInput
              type="text"
              name="phone"
              change={this.change}
              value={this.state.phone}
              placeholder="Phone"
            />
            <TextInput
              change={this.change}
              value={this.state.subject}
              name="subject"
              type="text"
              placeholder="Subject"
            />
            <textarea
              onChange={this.change}
              name="query"
              value={this.state.query}
              rows="5"
              placeholder="Your Query..."
            ></textarea>
            <CustomButton name={"get support"} submit={this.submit} />
          </form>
        </CockPit>
      </div>
    );
  }
}
