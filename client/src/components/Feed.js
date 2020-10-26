import React, { useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import Delete from "@material-ui/icons/Delete";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import clsx from "clsx";
import moment from "moment";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useMutation } from "react-apollo";
import {
  COMMENT_CREATE_MUTATION,
  COMMENT_DELETE_MUTATION,
  POST_DELETE_MUTATION,
  POST_LIKE_MUTATION,
} from "../gql/posts/postMutation";
import { GET_POSTS_QUERY } from "../gql/posts/postQueries";
import { useHistory } from "react-router-dom";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import { Link } from "react-router-dom";
import Message from "../screens/MessageScreen";
import {
  Button,
  Divider,
  FormControl,
  Grid,
  TextField,
} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 345,
    marginTop: "1rem",
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

const Feed = ({
  post: {
    _id,
    body,
    comments,
    createdAt,
    likes,
    totalLike,
    totalComment,
    image,
    user: postedUser,
  },
  refetch,
  single,
}) => {
  const classes = useStyles();

  const commonRef = useRef(null);

  const [expanded, setExpanded] = React.useState(false);

  const [like, setLike] = React.useState(false);

  const [comment, setComment] = React.useState("");

  // const [commentId, setCommentId] = React.useState(null);

  const [loadingLike, setLoadingLike] = React.useState(false);

  const { user } = useSelector((state) => state.user);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const history = useHistory();

  const [deletePostFunc, { error }] = useMutation(POST_DELETE_MUTATION, {
    async update(_, __) {
      await refetch();
      setLoadingLike(false);
      history.push("/");
    },
    variables: {
      postId: _id,
    },
    refetchQueries: [{ query: GET_POSTS_QUERY }],
    awaitRefetchQueries: true,
  });

  const [createCommentFunc, { error: commentError }] = useMutation(
    COMMENT_CREATE_MUTATION,
    {
      update: async (_, __) => {
        await refetch();
        setComment("");
        commonRef.current.blur();
        setLoadingLike(false);
      },
      variables: {
        postId: _id,
        body: comment,
      },
      refetchQueries: [{ query: GET_POSTS_QUERY }],
      awaitRefetchQueries: true,
    }
  );

  const [likePostFunc, ___] = useMutation(POST_LIKE_MUTATION, {
    async update(_, __) {
      await refetch();
      setLoadingLike(false);
    },
    variables: {
      postId: _id,
    },
    refetchQueries: [{ query: GET_POSTS_QUERY }],
    awaitRefetchQueries: true,
  });

  const [deleteCommentFunc, $] = useMutation(COMMENT_DELETE_MUTATION, {
    async update(_, __) {
      await refetch();
      setLoadingLike(false);
    },
    refetchQueries: [{ query: GET_POSTS_QUERY }],
    awaitRefetchQueries: true,
  });

  const handleDelete = (e) => {
    if (user) {
      if (window.confirm("are you sure!")) {
        if (!loadingLike) {
          deletePostFunc();
          setLoadingLike(true);
        }
      } else {
        history.push("/login?redirect=posts/" + _id);
      }
    }
    if (window.confirm("are you sure!")) {
    }
  };

  const handleDeleteComment = (e, commentId) => {
    if (user) {
      if (window.confirm("are you sure!")) {
        if (!loadingLike) {
          deleteCommentFunc({ variables: { postId: _id, commentId } });
          setLoadingLike(true);
        }
      } else {
        history.push("/login?redirect=posts/" + _id);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user) {
      if (!loadingLike) {
        if (comment !== "") {
          setLoadingLike(true);
          createCommentFunc();
        }
      }
    } else {
      history.push("/login?redirect=posts/" + _id);
    }
  };

  const handleLike = (e) => {
    if (user) {
      if (!loadingLike) {
        likePostFunc();
        setLoadingLike(true);
      }
    } else {
      history.push("/login?redirect=posts/" + _id);
    }
  };

  useEffect(() => {
    if (user && likes.find((like) => user._id === like.user)) {
      setLike(true);
    } else {
      setLike(false);
    }
  }, [likes, user]);

  return (
    <motion.div
      id={_id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}>
      <Card className={classes.root}>
        <CardHeader
          avatar={
            <Avatar aria-label="recipe" className={classes.avatar}>
              {postedUser.username[0].toUpperCase()}
            </Avatar>
          }
          action={
            user &&
            user._id === postedUser._id && (
              <IconButton
                onClick={handleDelete}
                style={{ color: "red" }}
                aria-label="settings">
                <Delete color="error" />
              </IconButton>
            )
          }
          title={postedUser.username}
          subheader={moment(Number(createdAt)).calendar()}
        />
        {error &&
          error.graphQLErrors.map(({ message }, i) => (
            <Message message={message} key={i} />
          ))}

        {error && error.networkError && (
          <Message message={error.networkError.message} />
        )}
        {commentError &&
          commentError.graphQLErrors.map(({ message }, i) => (
            <Message message={message} key={i} />
          ))}

        {commentError && commentError.networkError && (
          <Message message={commentError.networkError.message} />
        )}
        {single ? (
          <CardMedia
            className={classes.media}
            image={
              image
                ? image
                : "https://www.simplilearn.com/ice9/course_images/icons/DMAdvanced-Social-Media.svgz"
            }
            title="Paella dish"
          />
        ) : (
          <Link
            to={`posts/${_id}`}
            style={{ textDecoration: "none", color: "inherit" }}>
            <CardMedia
              className={classes.media}
              image={
                image
                  ? image
                  : "https://www.simplilearn.com/ice9/course_images/icons/DMAdvanced-Social-Media.svgz"
              }
              title="Paella dish"
            />
          </Link>
        )}

        <CardContent>
          <Typography variant="caption" paragraph>
            # {body}
          </Typography>
          <Divider />
        </CardContent>
        <CardActions disableSpacing>
          {totalLike}
          <IconButton onClick={handleLike} aria-label="add to favorites">
            {like ? (
              <FavoriteIcon color="secondary" />
            ) : (
              <FavoriteBorderIcon color="action" />
            )}
          </IconButton>

          <Typography
            paragraph
            variant="body2"
            style={{
              paddingTop: ".9rem",
              textAlign: "center",
              marginLeft: "auto",
            }}>
            {totalComment > 1
              ? `${totalComment} comments`
              : `${totalComment} comment`}
          </Typography>
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more">
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <form onSubmit={handleSubmit} className="form-comment">
              <Grid container>
                <Grid item xs={10}>
                  <FormControl fullWidth color="primary" focused>
                    <TextField
                      ref={commonRef}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      id="comment"
                      placeholder="write a comment..."
                      variant="outlined"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={2}>
                  <Button
                    style={{ height: "100%" }}
                    type="submit"
                    color="primary"
                    startIcon={<SendIcon />}></Button>
                </Grid>
              </Grid>
            </form>
            {comments &&
              comments.map((c) => (
                <Grid
                  container
                  key={c._id}
                  justify="center"
                  alignItems="center">
                  <Grid item xs={2}>
                    <Avatar
                      className="avatar-comment"
                      aria-label="recipe"
                      style={{ backgroundColor: "#150669" }}>
                      {c.username[0].toUpperCase()}
                    </Avatar>
                  </Grid>
                  <Grid item xs={10}>
                    <Typography variant="caption" className="comment" paragraph>
                      {c.body}
                      <sub className="sub">
                        {moment(Number(c.createdAt)).fromNow()}
                      </sub>
                      {user && user._id === c.user && (
                        <IconButton
                          onClick={(e) => handleDeleteComment(e, c._id)}
                          style={{ color: "red" }}
                          aria-label="settings">
                          <Delete color="error" />
                        </IconButton>
                      )}
                    </Typography>
                  </Grid>
                </Grid>
              ))}
          </CardContent>
        </Collapse>
      </Card>
    </motion.div>
  );
};

export default Feed;
