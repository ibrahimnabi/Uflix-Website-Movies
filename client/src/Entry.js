import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import SignIn from "./pages/signin";
import SignUp from "./pages/signup";
import App from "./App";

import {
  removeToken,
  setToken,
  setUser,
  removeUser,
  getToken,
  getUser
} from "./util/api";

class Entry extends React.Component {
  state = {
    isLoggedIn: false
  };

  componentDidMount() {
    const token = getToken();
    const user = getUser();
    if (token || user) {
      this.setState({
        isLoggedIn: true
      });
    }
  }

  signout = () => {
    removeToken();
    removeUser();
    this.setState({
      isLoggedIn: false
    });
  };

  signIn = (user, token) => {
    setToken(token);
    setUser(user);
    this.setState({
      isLoggedIn: true
    });
  };

  render() {
    return (
      <React.Fragment>
        {this.state.isLoggedIn ? (
          <App isLoggedIn={this.state.isLoggedIn} signout={this.signout}></App>
        ) : (
          <Switch>
            <Route exact path="/">
              <SignIn signIn={this.signIn}></SignIn>
            </Route>
            <Route exact path="/signup">
              <SignUp></SignUp>
            </Route>
          </Switch>
        )}
      </React.Fragment>
    );
  }
}

export default withRouter(Entry);
