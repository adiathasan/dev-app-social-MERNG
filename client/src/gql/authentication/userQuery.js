import gql from "graphql-tag";

const GET_SINGLE_USER_QUERY = gql`
  query($userId: ID!) {
    getUserById(userId: $userId) {
      user {
        _id
        username
        email
        followers {
          user
          username
        }
        following {
          user
          username
        }
      }
      posts {
        _id
        body
        comments {
          _id
          user
          username
          createdAt
        }
        likes {
          _id
          user
          createdAt
          username
        }
        user {
          username
          _id
          email
        }
        totalComment
        totalLike
        createdAt
      }
    }
  }
`;

export { GET_SINGLE_USER_QUERY };
