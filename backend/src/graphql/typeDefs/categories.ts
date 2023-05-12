import gql from "graphql-tag";

const typeDefs = gql`
  scalar Date

  type Category {
    id: String
    title: String
    desc: String
    createdAt: Date
  }

  type Query {
    queryCategory(id: String): [Category]
  }

  type Mutation {
    createCategory(id: String, title: String, desc: String): Boolean
  }
`;

export default typeDefs;
