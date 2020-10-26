import {
  Button,
  Divider,
  FormControl,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "react-apollo";
import { LOGIN_MUTATION } from "../gql/authentication/userMutation";
import { LOADER_REQUEST, LOADER_SUCCESS } from "../constants/postConstants";
import Message from "../components/Message";
import { useDispatch, useSelector } from "react-redux";
import { userSignUpAction } from "../actions/userActions";

const LoginScreen = ({ history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [resultUser, setResultUser] = useState(null);
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);

  const [loginFunc, { loading }] = useMutation(LOGIN_MUTATION, {
    update(_, { data }) {
      setResultUser(data);
    },
    variables: {
      email,
      password,
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginFunc();
    } catch (error) {
      setMessage(error);
      dispatch({ type: LOADER_SUCCESS });
    }
  };

  const redirect = history.location.search
    ? history.location.search.split("=")[1]
    : "/";

  useEffect(() => {
    if (user) {
      history.push(redirect);
    } else {
      if (loading) {
        dispatch({ type: LOADER_REQUEST });
      } else if (!loading && resultUser) {
        dispatch(userSignUpAction(resultUser));
        dispatch({ type: LOADER_SUCCESS });
      }
    }
  }, [loading, dispatch, history, user, resultUser, redirect]);

  return (
    <>
      <Grid item xs={1} sm={3} />
      <Grid item xs={10} sm={6} justify="center" container>
        <Typography variant="h4" style={{ color: "darkblue" }}>
          Login
          <Divider />
        </Typography>
        <form
          onSubmit={handleSubmit}
          style={{
            boxShadow: "0 2px 5px -1px rgba(0, 0, 0, .3)",
            padding: "2rem",
            borderRadius: "6px",
          }}>
          {message &&
            message.graphQLErrors.map(({ message }, i) => (
              <Message message={message} key={i} />
            ))}

          {message && message.networkError && (
            <Message message={message.networkError} />
          )}
          <FormControl
            noValidate
            autoComplete="on"
            style={{ width: "100%", textAlign: "center", marginTop: "1rem" }}>
            <TextField
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email-basic"
              label="email"
              type="email"
              color="secondary"
              required
            />
          </FormControl>
          <FormControl
            noValidate
            autoComplete="on"
            style={{ width: "100%", textAlign: "center", marginTop: "1rem" }}>
            <TextField
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password-basic"
              label="password"
              color="secondary"
              required
              type="password"
            />
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            style={{ marginTop: "2rem" }}>
            submit
          </Button>
        </form>
        <Typography variant="body1" color="textPrimary">
          Don't have an account?{" "}
          <Link to="/register" type="button">
            Register
          </Link>
        </Typography>
      </Grid>
      <Grid item xs={1} sm={3} />
    </>
  );
};

export default LoginScreen;
