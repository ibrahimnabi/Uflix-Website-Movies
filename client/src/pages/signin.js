import React from "react";
import logo from "../images/logo.png";
import CockPit from "../components/cockpit/cockpit";
import TextInput from "../components/textInput/textInput";
import CustomButton from "../components/button/button";
import { api } from "../util/api";
import { Link } from "react-router-dom";

import "./signin.css";

export default class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
  }
  change = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  submit = () => {
    console.log("clicked");
    const { email, password } = this.state;
    api
      .post("/user/login", { email, password })
      .then(result => {
        console.log(result.data);
        this.props.signIn(result.data.currentUser, result.data.token);
      })
      .catch(err => {
        alert("err");
      });
  };
  render() {
    return (
      <div className="signin">
        <CockPit>
          <img src={logo} alt="" />
          <p style={{ fontSize: "26px", textAlign: "center" }}>Sign In</p>
          <form>
            <TextInput
              placeholder="Email"
              value={this.state.email}
              change={this.change}
              type="text"
              name="email"
            />
            <TextInput
              placeholder="Password"
              value={this.state.password}
              change={this.change}
              type="password"
              name="password"
            />
            <CustomButton submit={this.submit} name={"Sign In"} />
            <p style={{ textAlign: "center" }}>
              Don't have an account?
              <Link style={{ color: "#c91e1e" }} to="/signup">
                Sign Up
              </Link>
            </p>
          </form>
        </CockPit>
      </div>
    );
  }
}
