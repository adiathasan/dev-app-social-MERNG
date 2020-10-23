import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import { GET_POSTS_QUERY } from "../gql/posts/postQueries";
import { useQuery } from "react-apollo";
import * as postTypes from "../constants/postConstants";
import Message from "../components/Message";
import Feed from "../components/Feed";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { Button, FormControl, IconButton, TextField } from "@material-ui/core";
const HomeScreen = () => {
  const [thoughts, setThoughts] = useState("");
  const [photo, setPhoto] = useState("");
  const [fileError, setFileError] = useState(null);

  const dispatch = useDispatch();
  const allPosts = useSelector((state) => state.allPosts);
  const { posts, error: errMessage } = allPosts;
  const { loading, data, error } = useQuery(GET_POSTS_QUERY);
  const imgTypes = ["image/png", "image/jpeg", "image/jpg"];

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (imgTypes.includes(file.type)) {
      setPhoto(file);
      setFileError(null);
    } else {
      setFileError("please select png, jpeg or jpg");
    }
  };

  const useStyles = makeStyles((theme) => ({
    photo: {
      height: "25px",
    },
    button: {
      marginTop: "2rem",
    },
    form: {
      boxShadow: "0 2px 5px -1px rgba(0, 0, 0, .3)",
      padding: " 1rem 2rem",
      borderRadius: "6px",
      width: "400px",
      maxWidth: "100%",
    },
  }));

  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (loading) {
      dispatch({ type: postTypes.LOADER_REQUEST });
    } else {
      dispatch({ type: postTypes.LOADER_SUCCESS });
    }
    if (data && posts.length === 0) {
      dispatch({ type: postTypes.GET_POSTS_SUCCESS, payload: data.getPosts });
    }
    if (error) {
      dispatch({ type: postTypes.GET_POSTS_FAIL, payload: error });
    }
  }, [dispatch, data, posts, error, loading]);
  const classes = useStyles();
  return (
    <Grid container className={classes.root}>
      <Grid item xs={1} sm={3} />
      {errMessage && <Message message={errMessage} />}
      <Grid item container xs={12} sm={6} justify="center">
        {user && (
          <form className={classes.form}>
            {fileError && <Message title="error" message={fileError} />}
            <FormControl
              noValidate
              autoComplete="on"
              style={{ width: "100%", textAlign: "center" }}>
              <TextField
                value={thoughts}
                onChange={(e) => setThoughts(e.target.value)}
                color="secondary"
                type="textarea"
                variant="standard"
                id="thought"
                placeholder="share your desktop  setup"
                fullWidth
                label="Thoughts!"
              />
            </FormControl>
            <FormControl style={{ width: "100%", textAlign: "center" }}>
              <TextField
                fullWidth
                className={classes.photo}
                value={photo}
                onChange={handlePhoto}
                type="file"
                variant="standard"
                id="photo"
                placeholder="photo"
                label="choose photo"
              />
            </FormControl>
            <Button
              variant="contained"
              className={classes.button}
              color="primary">
              post
            </Button>
          </form>
        )}
        {posts.length > 0 &&
          posts.map((post) => <Feed key={post._id} post={post} />)}
      </Grid>
      <Grid item xs={1} sm={3} />
    </Grid>
  );
};

export default HomeScreen;
