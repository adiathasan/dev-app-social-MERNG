import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { getPostsReducer, loaderReducer } from "./reducers/postReducers";
import { userSignUpReducer } from "./reducers/userReducers";

const reducer = combineReducers({
  loader: loaderReducer,
  allPosts: getPostsReducer,
  user: userSignUpReducer,
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
