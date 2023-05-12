import gql from "graphql-tag";

const typeDefs = gql`
  scalar Date

  type Tag {
    id: String
    title: String
    createdAt: Date
    posts: [PostTag]
  }

  type PostTag {
    id: String
    post: Post
    tag: Tag
    createdAt: Date
  }

  type Query {
    queryTags(id: String): [Tag]
  }

  type Mutation {
    createTag(id: String, title: String): Boolean
  }
`;

export default typeDefs;
