import React from "react";
import { Link } from "react-router-dom";
import "./sidebar.css";
import logo from "../../images/logo.png";

export default class SideBar extends React.Component {
  componentWillUnmount() {
    this.props.clearContext();
  }

  render() {
    return (
      <nav className="sidebar" ref={this.props.navbarContext}>
        <div className="nav-logo">
          <Link to="/">
            <img src={logo} alt="uflix"></img>
          </Link>
        </div>
        <div className="nav-links">
          <div className="nav-link">
            <Link to="/">Home</Link>
          </div>

          <div className="nav-link">
            <Link to="/movies">Movies</Link>
          </div>
          <div className="nav-link">
            <Link to="/tvshows">TV Shows</Link>
          </div>
          <div className="nav-link">
            <Link to="/favourite">Favourite</Link>
          </div>
        </div>
        <div className="nav-control">
          <div className="search">
            <input
              onChange={this.props.change}
              name="search"
              type="text"
              placeholder="Search Movies and TV Shows"
            ></input>
            <button>
              <ion-icon name="search"></ion-icon>
            </button>
          </div>

          <label className="dropdown">
            <div className="dd-button">{this.props.username}</div>
            <input type="checkbox" className="dd-input" id="test" />

            <ul className="dd-menu">
              <Link to="/support">Support</Link>
              <Link to="/complaint">Complaint</Link>
              <Link to="/feedback">Feedback</Link>
              <Link to="/demand-movies">Demand Movies</Link>
              <li className="divider"></li>
              <Link onClick={this.props.signout} to="/">
                SignOut
              </Link>
            </ul>
          </label>
        </div>
      </nav>
    );
  }
}
