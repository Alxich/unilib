import { gql } from "@apollo/client";

const TAG_QUERIES = {
  tags: gql`
    query Tags {
      tags {
        title
      }
    }
  `,
};

export default TAG_QUERIES;
