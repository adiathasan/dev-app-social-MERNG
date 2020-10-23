import {
  Button,
  Divider,
  FormControl,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "react-apollo";
import { REGISTER_MUTATION } from "../gql/authentication/userMutation";
import Message from "../components/Message";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState(null);
  const [addUser, { loading }] = useMutation(REGISTER_MUTATION, {
    update(proxy, result) {
      console.log(result);
    },
    variables: {
      username: name,
      email,
      password,
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === confirm) {
      try {
        await addUser();
      } catch (_) {
        setMessage("Oops! Email already in use");
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
      <Grid item xs={1} sm={4} />
      <Grid item xs={10} sm={4} justify="center" container>
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
              color="secondary"
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
              color="secondary"
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
              color="secondary"
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
            Submit
          </Button>
        </form>
        <Typography variant="h5" color="textPrimary">
          Already have an account?{" "}
          <IconButton>
            <Link to="/login" type="button">
              Login
            </Link>
          </IconButton>
        </Typography>
      </Grid>
      <Grid item xs={1} sm={4} />
    </>
  );
};

export default RegisterScreen;
