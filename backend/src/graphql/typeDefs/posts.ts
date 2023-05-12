import gql from "graphql-tag";

const typeDefs = gql`
  scalar Date

  type Post {
    id: String
    title: String
    content: String
    createdAt: Date
    author: User
    categoryId: String
    category: Category
    tags: [PostTag]
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
      categoryId: String
      tagsId: [String]
    ): Boolean
  }
`;

export default typeDefs;
