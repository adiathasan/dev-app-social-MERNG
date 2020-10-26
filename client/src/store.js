import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { getPostsReducer, loaderReducer } from "./reducers/postReducers";
import { userSignUpReducer } from "./reducers/userReducers";

export const HANDLE_ERROR = "HANDLE_ERROR";
export const DISMISS = "DISMISS";

const reducer = combineReducers({
  loader: loaderReducer,
  allPosts: getPostsReducer,
  user: userSignUpReducer,
  gqlError: (state = { message: null }, action) => {
    switch (action.type) {
      case "HANDLE_ERROR":
        return {
          message: action.payload,
        };
      case "DISMISS":
        return {
          message: null,
        };
      default:
        return state;
    }
  },
});

const userFromLocalStorage = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const initState = {
  user: {
    user: userFromLocalStorage,
  },
};

const store = createStore(
  reducer,
  initState,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;
