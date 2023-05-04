import gql from "graphql-tag";

const typeDefs = gql`
  scalar Date

  type Tag {
    id: String
    title: String
    createdAt: Date
  }

  type Query {
    queryTags(id: String): [Tag]
  }

  type Mutation {
    createPost(id: String, title: String): Boolean
  }
`;

export default typeDefs;
