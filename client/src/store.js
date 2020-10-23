import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { getPostsReducer, loaderReducer } from "./reducers/postReducers";

const reducer = combineReducers({
  loader: loaderReducer,
  allPosts: getPostsReducer,
});

const initState = {};

const store = createStore(
  reducer,
  initState,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;
