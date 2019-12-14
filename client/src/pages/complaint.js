import React from "react";
import CustomButton from "../components/button/button";
import TextInput from "../components/textInput/textInput";
import CockPit from "../components/cockpit/cockpit";
import { api, getUser, getToken } from "../util/api";
import "./complaint.css";

export default class Complaint extends React.Component {
  state = {
    subject: "",
    complaint: ""
  };
  change = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  submit = () => {
    const { subject, complaint } = this.state;
    const { _id } = getUser();
    const token = getToken();
    api
      .post(
        "/user/complaint/" + _id,
        { subject, complaint },
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
      <div className="complaint">
        <CockPit>
          <ion-icon name="information-circle"></ion-icon>
          <form>
            <TextInput
              change={this.change}
              value={this.state.subject}
              name="subject"
              type="text"
              placeholder="Subject"
            />
            <textarea
              onChange={this.change}
              value={this.state.complaint}
              name="complaint"
              rows="5"
              placeholder="Complaint..."
            ></textarea>
            <CustomButton submit={this.submit} name={"Submit Complaint"} />
          </form>
        </CockPit>
      </div>
    );
  }
}
