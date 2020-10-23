import React, { useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { useDispatch, useSelector } from "react-redux";
import { GET_POSTS_QUERY } from "../gql/posts/postQueries";
import { useQuery } from "react-apollo";
import * as postTypes from "../constants/postConstants";
import Message from "../components/Message";
import Feed from "../components/Feed";
import { makeStyles } from "@material-ui/core/styles";
import { Divider } from "@material-ui/core";

const HomeScreen = () => {
  const dispatch = useDispatch();
  const allPosts = useSelector((state) => state.allPosts);
  const { posts, error: errMessage } = allPosts;
  const { loading, data, error } = useQuery(GET_POSTS_QUERY);

  const useStyles = makeStyles((theme) => ({
    root: {},
  }));

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
        <Divider light />
        {posts.length > 0 &&
          posts.map((post) => <Feed key={post._id} post={post} />)}
      </Grid>
      <Grid item xs={1} sm={3} />
    </Grid>
  );
};

export default HomeScreen;
