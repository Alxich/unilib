import gql from "graphql-tag";

const typeDefs = gql`
  scalar Date

  type User {
    id: String
    username: String
    image: String
    banner: String
    aboutMe: String
    subscribedCategoryIDs: [String]
  }

  type Query {
    searchUsers(username: String!): [User]
    searchUser(id: String!): User
  }

  type Mutation {
    createUsername(username: String!): CreateItemResoponse
  }

  type CreateItemResoponse {
    success: Boolean
    error: String
  }
`;

export default typeDefs;
