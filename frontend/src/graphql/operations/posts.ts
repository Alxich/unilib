import { gql } from "@apollo/client";

const PostFields = `
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
    subscriberIDs
  }
  tags {
    id
    title
  }
  createdAt
  likes
  dislikes
  views
`;

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  Queries: {
    queryPosts: gql`
      query queryPosts($period: String,  $popular: Boolean, $skip: Int!, $take: Int!, $subscribedCategories: [String]) {
        queryPosts(period: $period, popular: $popular, skip: $skip, take: $take, subscribedCategories: $subscribedCategories) {
         ${PostFields}
        }
      }
    `,

    queryPostsByTag: gql`
      query queryPostsByTag($period: String, $popular: Boolean, $tagId: String!, $skip: Int!, $take: Int!) {
        queryPostsByTag(period: $period, popular: $popular, tagId: $tagId, skip: $skip, take: $take) {
          ${PostFields}
        }
      }
    `,

    queryPostsByCat: gql`
      query queryPostsByCat($period: String, $popular: Boolean, $catId: String!, $skip: Int!, $take: Int!) {
        queryPostsByCat(period: $period, popular: $popular, catId: $catId, skip: $skip, take: $take) {
          ${PostFields}
        }
      }
    `,

    queryPostsByAuthor: gql`
      query queryPostsByAuthor($period: String, $popular: Boolean, $authorId: String!, $skip: Int!, $take: Int!) {
        queryPostsByAuthor(period: $period, popular: $popular, authorId: $authorId, skip: $skip, take: $take) {
          ${PostFields}
        }
      }
    `,

    queryPost: gql`
      query queryPost($id: String!) {
        queryPost(id: $id) {
          ${PostFields}
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
          ${PostFields}
        }
      }
    `,

    addDislikeToPost: gql`
      mutation addDislikeToPost($id: ID!) {
        addDislikeToPost(id: $id) {
          ${PostFields}
        }
      }
    `,
  },
  Subscriptions: {},
};
