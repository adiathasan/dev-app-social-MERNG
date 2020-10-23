import * as postTypes from "../constants/postConstants";

const GetPostsAction = (data) => {
  return (dispatch) => {
    dispatch({ type: postTypes.GET_POSTS_REQUEST });
    dispatch({ type: postTypes.GET_POSTS_SUCCESS, payload: data });
  };
};

export { GetPostsAction };
