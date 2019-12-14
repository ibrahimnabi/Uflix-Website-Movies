import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import SideBar from "./components/sidebar/sidebar";
import Movie from "./pages/movie";
import Home from "./pages/home";
import DemandMovies from "./pages/demandMovies";
import Support from "./pages/support";
import Complaint from "./pages/complaint";
import Feedback from "./pages/feedback";
import Grid from "./pages/grid";
import Footer from "./components/footer/footer";

import { api, url, getToken, getUser } from "./util/api";
import Ham from "./components/hamburger-menu/hamburger-menu";
import "./app.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.navbar = React.createRef();
    this.state = {
      movies: [],
      search: "",
      user: null
    };
  }

  clearNavbarContext = () => {
    this.navbar = null;
  };

  getSearchResults = (movies, searchText) => {
    if (searchText == "") return movies;
    const filteredMovies = movies.filter(m =>
      m.title.toLowerCase().includes(this.state.search)
    );
    console.log(filteredMovies);
    return filteredMovies;
  };

  change = e => {
    this.setState({
      [e.target.name]: e.target.value
    });

    let filterCopy = [...this.state.movies].filter(m =>
      m.title.toLowerCase().includes(this.state.search)
    );
    if (!filterCopy.length) {
      this.setState({
        filteredMovies: []
      });
    } else {
      this.setState({
        filteredMovies: filterCopy
      });
    }
  };

  getFavMovies = () => {
    return this.state.movies.filter(m => m.isFav);
  };
  getFilteredMovies = type => {
    return this.state.movies.filter(m => m.type == type);
  };

  favouriteHandler = async (e, movie) => {
    const userId = getUser()._id;
    const token = getToken();
    const response = await api.get(`/user/movies/${userId}/favourates`, {
      headers: {
        authorization: token
      }
    });
    let data = response.data.favourites;
    let changeMovies = [...this.state.movies];
    if (data.filter(e => e._id == movie._id).length === 0 || data.length == 0) {
      console.log("hua ");

      data.push(Object.assign({}, movie));

      changeMovies = changeMovies.map(m => {
        if (m._id == movie._id) m.isFav = true;
        return m;
      });
    } else {
      console.log("ni hua ");
      data = data.filter(e => e._id !== movie._id);
      changeMovies = changeMovies.map(m => {
        if (m._id == movie._id) m.isFav = false;
        return m;
      });
    }
    this.setState({ movies: changeMovies });
    try {
      await api.patch(
        `/user/movies/${userId}/favourates`,
        {
          favourites: data
        },
        {
          headers: {
            authorization: token
          }
        }
      );
    } catch (error) {
      console.log("error ", error);
    }
  };

  componentWillMount() {
    const user = getUser();
    this.setState({ user: user });
  }

  navScroll = () => {
    let height = this.navbar.current.getBoundingClientRect().height;
    const isTop = window.scrollY > height;
    if (isTop) {
      this.navbar.current.classList.add("dark");
    } else {
      this.navbar.current.classList.remove("dark");
    }
  };

  componentWillUnmount() {
    document.removeEventListener("scroll", this.navScroll);
  }

  componentDidMount = async () => {
    const token = getToken();
    document.addEventListener("scroll", this.navScroll);
    const response = await api.get("/user/movies", {
      headers: {
        authorization: token
      }
    });
    const movies = response.data.movies.map(
      ({
        _id,
        cast,
        description,
        genre,
        image,
        title,
        language,
        video,
        trailer,
        artwork,
        rating,
        isFav,
        type
      }) => {
        return {
          _id,
          cast,
          description,
          genre,
          imgLink: url + "/" + image,
          title,
          language,
          video,
          trailer,
          artwork,
          rating,
          isFav,
          type
        };
      }
    );
    this.setState({
      movies: movies
    });
  };

  render() {
    return (
      <div className="app">
        <SideBar
          navbarContext={this.navbar}
          change={this.change}
          signout={this.props.signout}
          username={this.state.user.fname + " " + this.state.user.lname}
          clearContext={this.clearNavbarContext}
        />
        <Ham></Ham>
        {this.state.search ? (
          <Grid
            movies={this.getSearchResults(this.state.movies, this.state.search)}
            favouriteHandler={this.favouriteHandler}
            navbar={this.navbar}
          ></Grid>
        ) : (
          <Switch>
            <div className="screen">
              <Route exact path="/">
                <Home
                  movies={this.state.movies}
                  favouriteHandler={this.favouriteHandler}
                ></Home>
              </Route>
              <Route exact path="/demand-movies" component={DemandMovies} />
              <Route exact path="/support" component={Support} />
              <Route exact path="/complaint" component={Complaint} />
              <Route exact path="/movie" component={Movie} />
              <Route exact path="/feedback" component={Feedback} />
              <Route exact path="/movies">
                <Grid
                  movies={this.getFilteredMovies("Movie")}
                  favouriteHandler={this.favouriteHandler}
                  navbar={this.navbar}
                  name={"Movies"}
                ></Grid>
              </Route>
              <Route exact path="/tvshows">
                <Grid
                  movies={this.getFilteredMovies("TV Show")}
                  favouriteHandler={this.favouriteHandler}
                  navbar={this.navbar}
                  name={"TV Shows"}
                ></Grid>
              </Route>
              <Route exact path="/favourite">
                <Grid
                  name={"Favourites"}
                  movies={this.getFavMovies()}
                  favouriteHandler={this.favouriteHandler}
                  navbar={this.navbar}
                ></Grid>
              </Route>
            </div>
          </Switch>
        )}
        <Footer />
      </div>
    );
  }
}

export default withRouter(App);
