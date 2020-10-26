import gql from "graphql-tag";

const POST_CREATE_MUTATION = gql`
  mutation($image: String!, $body: String!) {
    createPost(image: $image, body: $body) {
      _id
      body
      image
      likes {
        user
      }
      comments {
        body
        user
      }
      user {
        _id
      }
    }
  }
`;

const POST_DELETE_MUTATION = gql`
  mutation($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const POST_LIKE_MUTATION = gql`
  mutation($postId: ID!) {
    likeUnlikePost(postId: $postId) {
      user {
        username
      }
    }
  }
`;

export { POST_CREATE_MUTATION, POST_DELETE_MUTATION, POST_LIKE_MUTATION };
