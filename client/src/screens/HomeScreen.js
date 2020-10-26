import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import { GET_POSTS_QUERY } from "../gql/posts/postQueries";
import { useQuery, useMutation } from "react-apollo";
import * as postTypes from "../constants/postConstants";
import Message from "../components/Message";
import Feed from "../components/Feed";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { Button, FormControl, TextField } from "@material-ui/core";
import { storage } from "../firebase";
import { POST_CREATE_MUTATION } from "../gql/posts/postMutation";
import { motion } from "framer-motion";
import SendIcon from "@material-ui/icons/Send";

let refetchCopy;

const HomeScreen = () => {
  const [thoughts, setThoughts] = useState("");
  const [photo, setPhoto] = useState("");
  const [photoUrl, setPhotoUrl] = useState(null);
  const [fileError, setFileError] = useState(null);

  const dispatch = useDispatch();
  const allPosts = useSelector((state) => state.allPosts);
  const { message } = useSelector((state) => state.gqlError);
  const { posts } = allPosts;
  const { loading, data, error, refetch } = useQuery(GET_POSTS_QUERY, {
    fetchPolicy: "network-only",
  });

  refetchCopy = refetch;

  const imgTypes = ["image/png", "image/jpeg", "image/jpg"];

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (imgTypes.includes(file.type)) {
      setPhoto(file);
      setFileError(null);
    } else {
      setFileError("please select png, jpeg or jpg");
      setPhoto("");
    }
  };

  const [postCreateFunc, { error: postError }] = useMutation(
    POST_CREATE_MUTATION,
    {
      async update(_, { data }) {
        await refetch();
        dispatch({
          type: postTypes.GET_POSTS_SUCCESS,
          payload: [...posts, data.createPost],
        });
        dispatch({ type: postTypes.LOADER_SUCCESS });
        setThoughts("");
        setPhoto("");
        setPhotoUrl(null);
      },
      variables: {
        body: thoughts,
        image: photoUrl,
      },
      refetchQueries: [{ query: GET_POSTS_QUERY }],
      awaitRefetchQueries: true,
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (photo !== "") {
      dispatch({ type: postTypes.LOADER_REQUEST });
      const fileRef = storage.ref(photo.name);
      fileRef.put(photo).on(
        "state_changed",
        (_) => "",
        (error) => {
          setFileError(error);
        },
        async () => {
          const downloadedUrl = await fileRef.getDownloadURL();
          setPhotoUrl(downloadedUrl);
          await postCreateFunc();
          document.getElementById("photo").value = "";
        }
      );
    } else {
      setFileError("please select a photo");
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
      {error &&
        error.graphQLErrors.map(({ message }, i) => (
          <Message message={message} key={i} />
        ))}
      {postError &&
        postError.graphQLErrors.map(({ message }, i) => (
          <Message message={message} key={i} />
        ))}

      {message && <Message message={message} />}
      <Grid item xs={1} sm={3} />

      <Grid item container xs={12} sm={6} justify="center">
        {user && (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={classes.form}
            onSubmit={handleSubmit}>
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
                onChange={handlePhoto}
                type="file"
                variant="standard"
                id="photo"
                placeholder="photo"
                label="choose photo"
              />
            </FormControl>
            <Button
              endIcon={<SendIcon />}
              type="submit"
              variant="contained"
              className={classes.button}
              color="primary">
              post
            </Button>
          </motion.form>
        )}
        {data &&
          data.getPosts.map((post) => (
            <Feed key={post._id} post={post} refetch={refetchCopy} />
          ))}
      </Grid>
      <Grid item xs={1} sm={3} />
    </Grid>
  );
};

export default HomeScreen;
