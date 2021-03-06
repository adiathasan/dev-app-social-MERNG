import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./components/Header";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import CssBaseline from "@material-ui/core/CssBaseline";
import MessageScreen from "./screens/MessageScreen";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import SinglePostScreen from "./screens/SinglePostScreen";
import "./index.css";
import Footer from "./components/Footer";
import ProfileScreen from "./screens/ProfileScreen";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: "5rem",
    minHeight: "75vh",
  },
}));

function App() {
  const classes = useStyles();

  return (
    <Router>
      <CssBaseline />
      <Grid container direction="column">
        <Grid item container>
          <Header />
        </Grid>
        <Grid item container className={classes.root}>
          <Switch>
            <Route path="/messages" component={MessageScreen} />
            <Route path="/login" component={LoginScreen} />
            <Route path="/register" component={RegisterScreen} />
            <Route path="/profile/:userId" component={ProfileScreen} />
            <Route path="/profile" component={ProfileScreen} exact />
            <Route path="/posts/:postId" component={SinglePostScreen} />
            <Route path="/" component={HomeScreen} exact />
          </Switch>
        </Grid>
        <Grid item container>
          <Footer />
        </Grid>
      </Grid>
    </Router>
  );
}

export default App;
