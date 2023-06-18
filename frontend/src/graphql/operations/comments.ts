import { gql } from "@apollo/client";

const CommentFields = `
  id
  author {
    id
    image
    username
  }
  parent {
    id
  }
  parentId
  text
  likes
  dislikes
  createdAt
  replies {
    id
  }
`;

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  Queries: {
    queryComment: gql`
      query QueryComment($id: String!) {
        queryComment(id: $id) {
          ${CommentFields}
        }
      }
    `,

    queryComments: gql`
      query QueryComments {
        queryComments {
          ${CommentFields}
          post {
            id
          }
        }
      }
    `,

    queryPostComments: gql`
      query QueryPostComments($postId: String!, $skip: Int!, $take: Int!) {
        queryPostComments(postId: $postId, skip: $skip, take: $take) {
          ${CommentFields}
        }
      }
    `,

    queryUserComments: gql`
      query QueryUserComments($userId: String!, $skip: Int!, $take: Int!) {
        queryUserComments(userId: $userId, skip: $skip, take: $take) {
          ${CommentFields}
        }
      }
    `,
  },
  Mutations: {
    createComment: gql`
      mutation CreateComment($input: CreateCommentInput!) {
        createComment(input: $input) {
          ${CommentFields}
        }
      }
    `,

    deleteComment: gql`
      mutation DeleteComment($id: String!) {
        deleteComment(id: $id) {
          success
          error
        }
      }
    `,

    addLikeToComment: gql`
      mutation AddLikeToComment($id: String!) {
        addLikeToComment(id: $id) {
          ${CommentFields}
        }
      }
    `,

    addDislikeToComment: gql`
      mutation AddDislikeToComment($id: String!) {
        addDislikeToComment(id: $id) {
          ${CommentFields}
        }
      }
    `,
  },
  Subscriptions: {},
};
