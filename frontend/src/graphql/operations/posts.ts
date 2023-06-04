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
      query queryPosts($skip: Int!, $take: Int!) {
        queryPosts(skip: $skip, take: $take) {
         ${PostFields}
        }
      }
    `,

    queryPostsByTag: gql`
      query queryPostsByTag($tagId: String!, $skip: Int!, $take: Int!) {
        queryPostsByTag(tagId: $tagId, skip: $skip, take: $take) {
          ${PostFields}
        }
      }
    `,

    queryPostsByCat: gql`
      query queryPostsByCat($catId: String!, $skip: Int!, $take: Int!) {
        queryPostsByCat(catId: $catId, skip: $skip, take: $take) {
          ${PostFields}
        }
      }
    `,

    queryPostsByAuthor: gql`
      query queryPostsByAuthor($authorId: String!, $skip: Int!, $take: Int!) {
        queryPostsByAuthor(authorId: $authorId, skip: $skip, take: $take) {
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
