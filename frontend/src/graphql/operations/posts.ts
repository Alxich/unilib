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
          }
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
  },
  Subscriptions: {},
};
