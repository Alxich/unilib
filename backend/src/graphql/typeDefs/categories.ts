import gql from "graphql-tag";

const typeDefs = gql`
  scalar Date

  type Category {
    banner: String
    icon: String
    id: String
    title: String
    desc: String
    subscribers: [User]
    subscriberCount: Int
    subscriberIDs: [String]
    createdAt: Date
    updatedAt: Date
    posts: [Post]
  }

  type Query {
    queryCategory(id: String): Category
    queryCategories(id: String): [Category]
    queryCategoriesByUser(id: String): [Category]
  }

  type Mutation {
    createCategory(
      id: String
      title: String
      desc: String
      banner: String
      icon: String
    ): Category
    updateCategory(
      id: String
      title: String
      desc: String
      banner: String
      icon: String
    ): Category
    subscribeToCategory(categoryId: String, userId: String): Category
    unsubscribeToCategory(categoryId: String, userId: String): Category
  }

  type Subscription {
    userUpdated: User
  }
`;

export default typeDefs;
