import * as userTypes from "../constants/userConstants";

const userSignUpAction = ({ login }) => (dispatch) => {
  localStorage.setItem("user", JSON.stringify(login));
  dispatch({ type: userTypes.SIGN_UP_SUCCESS, payload: login });
};

export { userSignUpAction };
