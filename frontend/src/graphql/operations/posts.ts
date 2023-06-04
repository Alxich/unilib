import { gql } from "@apollo/client";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  Queries: {
    queryPosts: gql`
      query queryPosts($skip: Int!, $take: Int!) {
        queryPosts(skip: $skip, take: $take) {
          id
          title
          content
          author {
            id
            username
          }
          category {
            id
            title
          }
          createdAt
        }
      }
    `,
    queryPostsByTag: gql`
      query queryPostsByTag($tagId: String!, $skip: Int!, $take: Int!) {
        queryPostsByTag(tagId: $tagId, skip: $skip, take: $take) {
          id
          title
          content
          author {
            id
            username
          }
          category {
            id
            title
          }
          createdAt
          tags {
            id
            title
          }
        }
      }
    `,
    queryPost: gql`
      query queryPost($id: String!) {
        queryPost(id: $id) {
          id
          title
          content
          author {
            id
            username
          }
          category {
            id
            title
          }
          createdAt
          tags {
            id
            title
          }
          views
          likes
          dislikes
        }
      }
    `,
  },
  Mutations: {
    createPost: gql`
      mutation createPost(
        $title: String
        $content: String
        $authorId: String
        $categoryId: String
        $tagsId: [TagInput]
      ) {
        createPost(
          title: $title
          content: $content
          authorId: $authorId
          categoryId: $categoryId
          tagsId: $tagsId
        )
      }
    `,

    addLikeToPost: gql`
      mutation addLikeToPost($id: ID!) {
        addLikeToPost(id: $id) {
          id
          title
          content
          author {
            id
            username
          }
          category {
            id
            title
          }
          createdAt
          tags {
            id
            title
          }
          views
          likes
          dislikes
        }
      }
    `,

    addDislikeToPost: gql`
      mutation addDislikeToPost($id: ID!) {
        addDislikeToPost(id: $id) {
          id
          title
          content
          author {
            id
            username
          }
          category {
            id
            title
          }
          createdAt
          tags {
            id
            title
          }
          views
          likes
          dislikes
        }
      }
    `,
  },
  Subscriptions: {},
};
