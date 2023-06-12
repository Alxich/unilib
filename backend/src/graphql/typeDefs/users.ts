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
    followedBy: [Follow]
  }

  type Follow {
    id: ID!
    follower: User!
    following: User!
  }

  type Query {
    searchUsers(username: String!): [User]
    searchUser(id: String!): User
  }

  type Mutation {
    createUsername(username: String!): CreateItemResoponse
    followUser(followerId: String!, followingId: String!): FollowUserResoponse
    unfollowUser(
      followerId: String!
      followingId: String!
    ): UnfollowUserResoponse
  }

  type FollowUserResoponse {
    followerId: String
    followingId: String!
  }

  type UnfollowUserResoponse {
    success: Boolean
    error: String
  }

  type CreateItemResoponse {
    success: Boolean
    error: String
  }
`;

export default typeDefs;
