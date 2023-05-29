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
    tags: [Tag]
  }

  type Query {
    queryPosts(take: Int!, skip: Int!): [Post]
    queryPost(id: String!): Post
  }

  input TagInput {
    id: String
  }

  type Mutation {
    createPost(
      title: String
      content: String
      authorId: String
      categoryId: String
      tagsId: [TagInput]
    ): Boolean
  }
`;

export default typeDefs;
