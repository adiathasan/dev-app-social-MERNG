import {
  Button,
  Divider,
  FormControl,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <Grid item xs={1} sm={4} />
      <Grid item xs={10} sm={4} justify="center" container>
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
        <Typography variant="h5" color="textPrimary">
          Don't have an account?{" "}
          <Link to="/register" type="button">
            Register
          </Link>
        </Typography>
      </Grid>
      <Grid item xs={1} sm={4} />
    </>
  );
};

export default LoginScreen;
