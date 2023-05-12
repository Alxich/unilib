import { gql } from "@apollo/client";

const POST_QUERIES = {
  posts: gql`
    query Posts {
      posts {
        title
        content
        authorId
      }
    }
  `,
};

export default POST_QUERIES;
