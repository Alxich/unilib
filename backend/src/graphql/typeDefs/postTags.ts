import gql from "graphql-tag";

const typeDefs = gql`
  type PostTag {
    id: String!
    post: Post!
    tag: Tag!
  }

  input PostTagInput {
    postId: String!
    tagId: String!
  }

  type Mutation {
    createPostTag(postTag: PostTagInput!): PostTag!
  }
`;

export default typeDefs;
