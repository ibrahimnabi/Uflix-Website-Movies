import React from "react";
import logo from "../images/logo.png";
import CockPit from "../components/cockpit/cockpit";
import TextInput from "../components/textInput/textInput";
import CustomButton from "../components/button/button";
import { api } from "../util/api";
import { Link } from "react-router-dom";
import "./signup.css";

export default class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: "",
      lname: "",
      email: "",
      password: "",
      confirmPassword: ""
    };
  }
  change = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  submit = () => {
    const { email, password, fname, lname, confirmPassword } = this.state;
    api
      .post("/user/", { email, password, fname, lname, confirmPassword })
      .then(result => {
        console.log(result);
        alert("User has been registered");
      })
      .catch(err => {
        alert("User has not been registered");
        console.log(err);
      });
  };
  render() {
    return (
      <div className="signup">
        <CockPit>
          <img src={logo} alt="" />
          <p style={{ fontSize: "26px", textAlign: "center" }}>Sign Up</p>
          <form>
            <TextInput
              placeholder="First Name"
              value={this.state.fname}
              change={this.change}
              type="text"
              name="fname"
            />
            <TextInput
              placeholder="Last Name"
              value={this.state.lname}
              change={this.change}
              type="text"
              name="lname"
            />
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
            <TextInput
              placeholder="Confirm Password"
              value={this.state.confirmPassword}
              change={this.change}
              type="password"
              name="confirmPassword"
            />
            <CustomButton name={"Next"} submit={this.submit} />
            <p style={{ textAlign: "center" }}>
              Already Have an account?
              <Link style={{ color: "#c91e1e" }} to="/">
                Sign In
              </Link>
            </p>
          </form>
        </CockPit>
      </div>
    );
  }
}
