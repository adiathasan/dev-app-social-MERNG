import React from "react";
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
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import clsx from "clsx";
import moment from "moment";
import { useSelector } from "react-redux";

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
    updatedAt,
    image,
    user: postedUser,
  },
}) => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const { user } = useSelector((state) => state.user);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            {postedUser.username.split("")[0]}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={postedUser.username}
        subheader={moment(Number(createdAt)).calendar()}
      />
      <CardMedia
        className={classes.media}
        image={
          image
            ? image
            : "https://www.simplilearn.com/ice9/course_images/icons/DMAdvanced-Social-Media.svgz"
        }
        title="Paella dish"
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {body}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        {totalLike}
        <IconButton aria-label="add to favorites">
          <FavoriteIcon
            color={
              user
                ? likes.map((like) => {
                    if (like.user === user._id) {
                      return "secondary";
                    }
                  })[0]
                : "inherit"
            }
          />
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
  );
};

export default Feed;
