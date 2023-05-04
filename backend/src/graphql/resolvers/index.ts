import merge from "lodash.merge";
import conversationResolvers from "./conversations";
import messageResolvers from "./messages";
import userResolvers from "./users";
import postResolvers from "./posts";
import scalarResolvers from "./scalars";

const resolvers = merge(
  {},
  userResolvers,
  scalarResolvers,
  conversationResolvers,
  messageResolvers,
  postResolvers
);

export default resolvers;
