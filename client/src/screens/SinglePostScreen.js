import React, { useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { GET_SINGLE_POST_QUERY } from "../gql/posts/postQueries";
import { useQuery } from "react-apollo";
import * as postTypes from "../constants/postConstants";
import Message from "../components/Message";
import Feed from "../components/Feed";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";

let refetchCopy;

const SinglePostScreen = ({ match, history }) => {
  const dispatch = useDispatch();
  const { loading, data, error, refetch } = useQuery(GET_SINGLE_POST_QUERY, {
    fetchPolicy: "network-only",
    variables: {
      postId: match.params.postId,
    },
    errorPolicy: "all",
  });

  refetchCopy = refetch;

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
    if (!user) {
      history.push(`/login?redirect=posts/${match.params.postId}`);
      dispatch({ type: postTypes.LOADER_SUCCESS });
    }
  }, [user, history]);

  useEffect(() => {
    if (loading) {
      dispatch({ type: postTypes.LOADER_REQUEST });
    } else {
      dispatch({ type: postTypes.LOADER_SUCCESS });
    }
  }, [dispatch, loading]);

  const classes = useStyles();

  return (
    <Grid container className={classes.root}>
      <Grid item xs={1} sm={3} />
      {error &&
        error.graphQLErrors.map(({ message }, i) => (
          <Message message={message} key={i} />
        ))}

      {error && error.networkError && (
        <Message message={error.networkError.message} />
      )}
      <Grid item container xs={12} sm={6} justify="center">
        {data && (
          <Feed
            single
            key={data.getPostById._id}
            post={data.getPostById}
            refetch={refetchCopy}
          />
        )}
      </Grid>
      <Grid item xs={1} sm={3} />
    </Grid>
  );
};

export default SinglePostScreen;
