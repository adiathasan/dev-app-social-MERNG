import * as postTypes from "../constants/postConstants";

const getPostsReducer = (state = { posts: [] }, action) => {
  switch (action.type) {
    case postTypes.GET_POSTS_SUCCESS:
      return {
        ...state,
        posts: action.payload,
      };
    case postTypes.GET_POSTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

const loaderReducer = (state = { isLoading: false }, action) => {
  switch (action.type) {
    case postTypes.LOADER_REQUEST:
      return {
        isLoading: true,
      };
    case postTypes.LOADER_SUCCESS:
      return {
        isLoading: false,
      };
    default:
      return state;
  }
};

export { getPostsReducer, loaderReducer };
