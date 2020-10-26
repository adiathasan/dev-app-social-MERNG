import * as userTypes from "../constants/userConstants";

const userSignUpReducer = (state = { user: null }, action) => {
  switch (action.type) {
    case userTypes.SIGN_UP_SUCCESS:
      return {
        ...state,
        user: action.payload,
      };
    case userTypes.SIGN_UP_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case userTypes.SIGN_UP_RESET:
      localStorage.removeItem("user");
      return {
        user: null,
      };
    default:
      return state;
  }
};

export { userSignUpReducer };
