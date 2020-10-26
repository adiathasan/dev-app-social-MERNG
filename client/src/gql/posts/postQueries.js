import gql from "graphql-tag";

export const GET_POSTS_QUERY = gql`
  {
    getPosts {
      totalComment
      totalLike
      image
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

export const GET_SINGLE_POST_QUERY = gql`
  query($postId: ID!) {
    getPostById(postId: $postId) {
      totalComment
      totalLike
      image
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
