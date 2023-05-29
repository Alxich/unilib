import merge from "lodash.merge";
import conversationResolvers from "./conversations";
import messageResolvers from "./messages";
import userResolvers from "./users";
import postResolvers from "./posts";
import categoryResolvers from "./categories";
import tagResolvers from "./tags";
import scalarResolvers from "./scalars";

const resolvers = merge(
  {},
  userResolvers,
  scalarResolvers,
  conversationResolvers,
  messageResolvers,
  postResolvers,
  categoryResolvers,
  tagResolvers
);

export default resolvers;
