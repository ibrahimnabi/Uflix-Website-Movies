import React from "react";
import "./hamburger-menu.css";
import { Link } from "react-router-dom";
import logo from "../../images/logo.png";

export default class Hamburger extends React.Component {
  state = {
    search: ""
  };
  change = e => {
    console.log(this.state);
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  search = () => {};
  render() {
    return (
      <nav role="navigation">
        <div id="menuToggle">
          <input type="checkbox" />
          <div>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div>
            <img src={logo}></img>
          </div>

          <ul id="menu">
            <div className="nav-logo">
              <img src={logo} alt="uflix"></img>
            </div>
            <div className="nav-links">
              <div className="nav-link">
                <ion-icon name="home"></ion-icon>
                <Link to="/">Home</Link>
              </div>
              <div className="nav-link">
                <ion-icon name="videocam"></ion-icon>
                <Link to="/movies">Movies</Link>
              </div>
              <div className="nav-link">
                <ion-icon name="film"></ion-icon>
                <Link to="/demand-movies">Demand Movies</Link>
              </div>
              <div className="nav-link">
                <ion-icon name="help-buoy"></ion-icon>
                <Link to="/support">Support</Link>
              </div>
              <div className="nav-link">
                <ion-icon name="volume-high"></ion-icon>
                <Link to="/complaint">Complaint</Link>
              </div>
              <div className="nav-link">
                <ion-icon name="thumbs-up"></ion-icon>
                <Link to="/feedback">Feedback</Link>
              </div>
              <div className="nav-link">
                <ion-icon name="log-out"></ion-icon>
                <Link onClick={this.props.signout} to="/">
                  SignOut
                </Link>
              </div>
            </div>
          </ul>
        </div>
      </nav>
    );
  }
}
