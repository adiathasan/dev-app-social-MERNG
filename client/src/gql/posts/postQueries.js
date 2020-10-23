import gql from "graphql-tag";

export const GET_POSTS_QUERY = gql`
  {
    getPosts {
      totalComment
      totalLike
      _id
      body
      comments {
        body
        user
        _id
        createdAt
        updatedAt
      }
      likes {
        _id
        user
      }
      createdAt
      updatedAt
      user {
        email
        username
        _id
      }
    }
  }
`;
