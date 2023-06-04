import { gql } from "@apollo/client";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  Queries: {
    queryTags: gql`
      query queryTags {
        queryTags {
          title
        }
      }
    `,
  },
  Mutations: {
    createTag: gql`
      mutation createTag($title: String) {
        createTag(title: $title)
      }
    `,
  },
  Subscriptions: {},
};