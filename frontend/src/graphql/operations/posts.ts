import { gql } from "@apollo/client";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  Queries: {
    queryPosts: gql`
      query queryPosts {
        queryPosts {
          title
          content
          author {
            id
            username
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
        $tagsId: [String]
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
