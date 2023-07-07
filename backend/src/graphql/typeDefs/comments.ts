import gql from "graphql-tag";

const typeDefs = gql`
  scalar Date

  type Comment {
    id: String
    author: User
    post: Post
    parent: Comment
    parentId: String
    text: String
    likes: Int
    dislikes: Int
    createdAt: Date
    updatedAt: Date
    replies: [Comment]
    isDeleted: Boolean
  }

  type Query {
    queryComment(id: String): Comment
    queryComments: [Comment]
    queryPostComments(postId: String!, take: Int!, skip: Int!): [Comment]
    queryUserComments(userId: String!, take: Int!, skip: Int!): [Comment]
    queryCommentsByComment(
      commentId: String!
      take: Int
      skip: Int
    ): [Comment]
  }

  type Mutation {
    createComment(input: CreateCommentInput!): Comment
    deleteComment(id: String!): Comment
    editComment(id: String!, text: String!): Comment
    addLikeToComment(id: String!): Comment
    addDislikeToComment(id: String!): Comment
  }

  input CreateCommentInput {
    authorId: String!
    postId: String!
    parentId: String
    text: String!
  }

  type DeleteItemResoponse {
    success: Boolean
    error: String
  }

  type Subscription {
    commentSent(postId: String): Comment
    commentsUpdated: Comment
  }
`;

export default typeDefs;
