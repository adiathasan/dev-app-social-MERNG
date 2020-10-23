import gql from "graphql-tag";

const REGISTER_MUTATION = gql`
  mutation register($username: String!, $email: String!, $password: String!) {
    register(
      registerInput: { username: $username, email: $email, password: $password }
    ) {
      _id
      username
      email
      token
      createdAt
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(loginInput: { email: $email, password: $password }) {
      _id
      username
      email
      token
      createdAt
    }
  }
`;

export { REGISTER_MUTATION, LOGIN_MUTATION };
