import { Avatar, Grid, IconButton, Tooltip, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-apollo";
import { useSelector, useDispatch } from "react-redux";
import { LOADER_REQUEST, LOADER_SUCCESS } from "../constants/postConstants";
import { GET_SINGLE_USER_QUERY } from "../gql/authentication/userQuery";
import SubscriptionsIcon from '@material-ui/icons/Subscriptions';
import Feed from "../components/Feed";

const ProfileScreen = ({ match: { params }, history }) => {
  const [userInfo, setUserInfo] = useState({});
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  
  const { data, error, loading, refetch } = useQuery(GET_SINGLE_USER_QUERY, {
    variables: { userId: params.userId ? params.userId : user ? user._id : ''},
  });

  const refetchCopy = refetch

  useEffect(() => {
    if (user) {
      if (loading) {
        dispatch({ type: LOADER_REQUEST });
      } else {
        setUserInfo(data.getUserById);
        dispatch({ type: LOADER_SUCCESS });
      }
    } else {
      history.push(
        params.userId
          ? "/login?redirect=profile/" + params.userId
          : "/login?redirect=profile"
      );
    }
  }, [
    user,
    history,
    dispatch,
    LOADER_REQUEST,
    LOADER_SUCCESS,
    params,
    loading,
    userInfo,
  ]);
  return (
    <Grid container item justify="center">
      <Grid xs={false} md={1} item />
      <Grid xs={12} sm={5} item className="profile__left">
        <Avatar src={userInfo?.image} className="profile__avatar" />
        <Typography variant="h5">{userInfo.user?.username}</Typography>
            <p>{userInfo.user?.email}</p>
            <Grid container item alignItems="center" >
                <Grid item className="profile__info">
                    {userInfo.user?.following ? userInfo.user?.followers.length : 0} {
                    userInfo.user?.following ? ( userInfo.user?.followers.length > 1 ? "followers": "follower") : "follower"
                    }
                </Grid>
                <Grid className="profile__info">
                    {userInfo.user?.following ? userInfo.user?.following.length: 0} following
                    
                </Grid>
            </Grid>
            <Grid container item alignItems="center" >
                <Grid className="profile__info">
                    {params.userId && <IconButton>
                        <SubscriptionsIcon color="primary"/>
                    </IconButton>}
                </Grid>
            </Grid>
      </Grid>
      <Grid xs={12} sm={5} item className="profile__right">
        <Typography variant="h4"> {params.userId ? `${userInfo.user?.username.toUpperCase()}'s POSTS` : "YOUR POSTS" } </Typography>
            {
                userInfo?.posts?.map(post => (
                    <Feed  key={post._id} post={post} refetch={refetchCopy} />
                ))
            }
      </Grid>
      <Grid xs={false} md={1} item />
    </Grid>
  );
};

export default ProfileScreen;
