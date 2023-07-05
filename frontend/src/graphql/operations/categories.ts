import { gql } from "@apollo/client";

const categoryFields = `
  banner
  icon
  title
  desc
  subscribers {
    id
  }
  subscriberCount
`;

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  Queries: {
    queryCategories: gql`
      query queryCategories {
        queryCategories {
          id
          icon
          title
        }
      }
    `,

    queryCategory: gql`
      query queryCategory($id: String) {
        queryCategory(id: $id) {
          ${categoryFields}
        }
      }
    `,

    queryCategoriesByUser: gql`
      query queryCategoriesByUser($id: String) {
        queryCategoriesByUser(id: $id) {
          id
          icon
          title
        }
      }
    `,
  },
  Mutations: {
    createCategory: gql`
      mutation createCategory(
        $title: String
        $desc: String
        $banner: String
        $icon: String
      ) {
        createCategory(title: $title, desc: $desc, banner: $banner, icon: $icon)
      }
    `,

    subscribeToCategory: gql`
      mutation subscribeToCategory($categoryId: String, $userId: String) {
        subscribeToCategory(categoryId: $categoryId, userId: $userId) {
          ${categoryFields}
        }
      }
    `,

    unsubscribeToCategory: gql`
      mutation unsubscribeToCategory($categoryId: String, $userId: String) {
        unsubscribeToCategory(categoryId: $categoryId, userId: $userId) {
          ${categoryFields}
        }
      }
    `,
  },
  Subscriptions: {
    userUpdated: gql`
      subscription UserUpdated {
        userUpdated {
          subscribedCategoryIDs
        }
      }
    `,
  },
};
