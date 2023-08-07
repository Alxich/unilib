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
    likes: Int
    likedBy: [User!]!
    dislikes: Int
    dislikedBy: [User!]!
    views: Int
  }

  type Query {
    queryPosts(
      period: String
      popular: Boolean
      take: Int!
      skip: Int!
      subscribedCategories: [String]
    ): [Post]
    queryPostsByTag(
      period: String
      popular: Boolean
      tagId: String!
      take: Int!
      skip: Int!
    ): [Post]
    queryPostsByCat(
      period: String
      popular: Boolean
      catId: String!
      take: Int!
      skip: Int!
    ): [Post]
    queryPostsByAuthor(
      period: String
      popular: Boolean
      authorId: String!
      take: Int!
      skip: Int!
    ): [Post]
    queryPost(id: String!): Post
    querySearchPosts(searchText: String!): [Post]
  }

  input TagInput {
    id: String
    title: String
  }

  type Mutation {
    createPost(
      title: String
      content: String
      authorId: String
      categoryId: String
      tagsId: [TagInput]
    ): Boolean

    addLikeToPost(id: ID!): Post
    addDislikeToPost(id: ID!): Post
  }
`;

export default typeDefs;
