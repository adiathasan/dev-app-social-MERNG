import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Alert, AlertTitle } from "@material-ui/lab";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function Message({ title = "warning", message }) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Alert variant="standard" severity={title}>
        {message} — <strong>!</strong>
      </Alert>
    </div>
  );
}
