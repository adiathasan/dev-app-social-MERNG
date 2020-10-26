import React, { useEffect } from "react";
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
  POST_DELETE_MUTATION,
  POST_LIKE_MUTATION,
} from "../gql/posts/postMutation";
import { GET_POSTS_QUERY } from "../gql/posts/postQueries";
import { useHistory } from "react-router-dom";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import { Link } from "react-router-dom";
import Message from "../screens/MessageScreen";
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
}) => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const [like, setLike] = React.useState(false);

  const [loadingLike, setLoadingLike] = React.useState(false);

  const { user } = useSelector((state) => state.user);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const history = useHistory();

  const [deletePostFunc, { error }] = useMutation(POST_DELETE_MUTATION, {
    async update(_, __) {
      await refetch();
      history.push("/");
    },
    variables: {
      postId: _id,
    },
    refetchQueries: [{ query: GET_POSTS_QUERY }],
    awaitRefetchQueries: true,
  });

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

  const handleDelete = (e) => {
    if (window.confirm("are you sure!")) {
      deletePostFunc();
    }
  };

  useEffect(() => {
    if (user && likes.find((like) => user._id === like.user)) {
      setLike(true);
    } else {
      setLike(false);
    }
  }, [likes, user]);

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
              {postedUser.username.split("")[0]}
            </Avatar>
          }
          action={
            user &&
            user._id === postedUser._id && (
              <IconButton
                onClick={handleDelete}
                style={{ color: "red" }}
                aria-label="settings">
                <Delete />
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

        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {body}
          </Typography>
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
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
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
            <Typography paragraph>Total Comments:{totalComment}</Typography>
            <Typography paragraph>Comments:</Typography>
            {comments.map((c) => (
              <Typography paragraph key={c._id}>
                {c.body}
              </Typography>
            ))}
          </CardContent>
        </Collapse>
      </Card>
    </motion.div>
  );
};

export default Feed;
