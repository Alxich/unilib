import { gql } from "@apollo/client";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  Queries: {
    queryCategories: gql`
      query queryCategories {
        queryCategories {
          title
          desc
        }
      }
    `,
  },
  Mutations: {
    createCategory: gql`
      mutation createCategory($title: String, $desc: String) {
        createCategory(title: $title, desc: $desc)
      }
    `,
  },
  Subscriptions: {},
};
