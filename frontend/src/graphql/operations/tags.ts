import { gql } from "@apollo/client";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  Queries: {
    queryPosts: gql`
      query queryPosts {
        queryTags {
          title
          content
        }
      }
    `,
  },
  Mutations: {
    createTag: gql`
      mutation createTag($title: String, $content: String) {
        createTag(title: $title, content: $content)
      }
    `,
  },
  Subscriptions: {},
};
