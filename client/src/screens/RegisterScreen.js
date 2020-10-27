import {
  Button,
  Divider,
  FormControl,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "react-apollo";
import { REGISTER_MUTATION } from "../gql/authentication/userMutation";
import Message from "../components/Message";
import { useDispatch, useSelector } from "react-redux";
import { LOADER_REQUEST, LOADER_SUCCESS } from "../constants/postConstants";
import { userSignUpAction } from "../actions/userActions";

const RegisterScreen = ({ history }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState(null);
  const [resultUser, setResultUser] = useState(null);
  const [registerFunc, { loading }] = useMutation(REGISTER_MUTATION, {
    update(_, { data }) {
      setResultUser(data);
    },
    variables: {
      username: name,
      email,
      password,
    },
  });

  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      history.push("/");
    } else {
      if (loading) {
        dispatch({ type: LOADER_REQUEST });
      } else if (!loading && resultUser) {
        dispatch(userSignUpAction({ login: resultUser.register }));
        dispatch({ type: LOADER_SUCCESS });
      }
    }
  }, [loading, dispatch, resultUser, history, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === confirm) {
      try {
        await registerFunc();
      } catch ({ graphQLErrors }) {
        setMessage("Oops! " + graphQLErrors[0].message);
        dispatch({ type: LOADER_SUCCESS });
        setTimeout(() => {
          setMessage(null);
        }, 4000);
      }
    } else {
      setMessage("Password do not match");
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  return (
    <>
      <Grid item xs={1} sm={3} />
      <Grid item xs={10} sm={6} justify="center" container>
        <Typography variant="h4" style={{ color: "darkblue" }}>
          Register
          <Divider />
        </Typography>
        <form
          onSubmit={handleSubmit}
          style={{
            boxShadow: "0 2px 5px -1px rgba(0, 0, 0, .3)",
            padding: "2rem",
            borderRadius: "6px",
          }}>
          {message && <Message title="warning" message={message} />}
          <FormControl
            noValidate
            autoComplete="on"
            style={{ width: "100%", textAlign: "center", marginTop: "1rem" }}>
            <TextField
              value={name}
              onChange={(e) => setName(e.target.value)}
              id="name-basic"
              label="name"
              color="primary"
              required
              type="text"
            />
          </FormControl>
          <FormControl
            noValidate
            autoComplete="on"
            style={{ width: "100%", textAlign: "center", marginTop: "1rem" }}>
            <TextField
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email-basic"
              label="email"
              color="primary"
              required
            />
          </FormControl>
          <FormControl
            noValidate
            autoComplete="on"
            style={{ width: "100%", textAlign: "center", marginTop: "1rem" }}>
            <TextField
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password-basic"
              label="password"
              color="primary"
              required
              type="password"
            />
          </FormControl>
          <FormControl
            noValidate
            autoComplete="on"
            style={{ width: "100%", textAlign: "center", marginTop: "1rem" }}>
            <TextField
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              id="confirm-basic"
              label="confirm password"
              color="primary"
              required
              type="password"
              error={password !== confirm}
            />
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            style={{ marginTop: "2rem" }}>
            Submit
          </Button>
        </form>
        <Typography variant="body1" color="textPrimary">
          Already have an account?{" "}
          <Link to="/login" type="button">
            Login
          </Link>
        </Typography>
      </Grid>
      <Grid item xs={1} sm={3} />
    </>
  );
};

export default RegisterScreen;
