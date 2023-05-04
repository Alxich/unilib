import gql from "graphql-tag";

const typeDefs = gql`
  scalar Date

  type Post {
    id: String
    title: String
    content: String
    author: User
    createdAt: Date
  }

  type Query {
    queryPosts(id: String): [Post]
  }

  type Mutation {
    createPost(
      id: String
      title: String
      content: String
      authorId: String
      authorName: String
    ): Boolean
  }
`;

export default typeDefs;
