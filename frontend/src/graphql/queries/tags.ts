import { gql } from "@apollo/client";

const POST_QUERIES = {
  posts: gql`
    query Posts {
      posts {
        title
        content
        authorId
        authorName
      }
    }
  `,
};

export default POST_QUERIES;
