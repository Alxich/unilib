import { gql } from "@apollo/client";

const CommentFields = `
  id
  post {
    id
    title
  }
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
  isDeleted
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
      query QueryComments($skip: Int, $take: Int) {
        queryComments(skip: $skip, take: $take) {
          ${CommentFields}
          post {
            id
          }
        }
      }
    `,

    queryPostComments: gql`
      query QueryPostComments($postId: String!, $skip: Int, $take: Int) {
        queryPostComments(postId: $postId, skip: $skip, take: $take) {
          ${CommentFields}
          replies {
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
            isDeleted
          }
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

    queryCommentsByComment: gql`
      query QueryCommentsByComment($commentId: String!, $skip: Int, $take: Int) {
        queryCommentsByComment(commentId: $commentId, skip: $skip, take: $take) {
          ${CommentFields}
          replies {
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
            isDeleted
          }
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
          ${CommentFields}
          replies {
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
            isDeleted
          }
        }
      }
    `,

    editComment: gql`
    mutation EditComment($id: String!, $text: String!) {
      editComment(id: $id, text: $text) {
        ${CommentFields}
        replies {
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
          isDeleted
        }
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
  Subscriptions: {
    commentSent: gql`
      subscription CommentSent($postId: String!) {
        commentSent(postId: $postId) {
          ${CommentFields}
          replies {
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
            isDeleted
          }
        }
      }
    `,
    commentsUpdated: gql`
    subscription CommentsUpdated {
      commentsUpdated {
        ${CommentFields}
      }
    }`,
  },
};
