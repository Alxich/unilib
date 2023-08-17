import { gql } from "@apollo/client";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  Queries: {
    searchUsers: gql`
      query SearchUsers($username: String!) {
        searchUsers(username: $username) {
          id
          username
        }
      }
    `,
    searchUser: gql`
      query searchUser($id: String!) {
        searchUser(id: $id) {
          id
          username
          image
          banner
          aboutMe
          subscribedCategoryIDs
          email
          createdAt
          followedBy {
            follower {
              id
              username
              image
            }
            following {
              id
              username
              image
            }
          }
        }
      }
    `,
    queryUsers: gql`
      query queryUsers {
        queryUsers {
          id
          username
          image
          banner
          aboutMe
          subscribedCategoryIDs
          email
          createdAt
          followedBy {
            follower {
              id
              username
              image
            }
            following {
              id
              username
              image
            }
          }
          posts {
            id
          }
        }
      }
    `,
  },
  Mutations: {
    createUsername: gql`
      mutation CreateUsername($username: String!) {
        createUsername(username: $username) {
          success
          error
        }
      }
    `,
    updateUser: gql`
      mutation UpdateUser(
        $username: String
        $desc: String
        $image: String
        $banner: String
        $password: String
      ) {
        updateUser(
          username: $username
          desc: $desc
          image: $image
          banner: $banner
          password: $password
        ) {
          success
          error
        }
      }
    `,
    followUser: gql`
      mutation followUser($followerId: String!, $followingId: String!) {
        followUser(followerId: $followerId, followingId: $followingId) {
          followerId
          followingId
        }
      }
    `,
    unfollowUser: gql`
      mutation unfollowUser($followerId: String!, $followingId: String!) {
        unfollowUser(followerId: $followerId, followingId: $followingId) {
          success
          error
        }
      }
    `,
  },
  Subscriptions: {},
};
