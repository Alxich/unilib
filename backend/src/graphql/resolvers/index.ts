import merge from "lodash.merge";
import conversationResolvers from "./conversations";
import messageResolvers from "./messages";
import userResolvers from "./users";
import postResolvers from "./posts";
import categoryResolvers from "./categories";
import tagResolvers from "./tags";
import commentResolvers from "./comments";
import scalarResolvers from "./scalars";

// Combine resolver functions from different modules into a single object


const resolvers = merge(
  {},
  userResolvers,
  scalarResolvers,
  conversationResolvers,
  messageResolvers,
  postResolvers,
  categoryResolvers,
  tagResolvers,
  commentResolvers
);

export default resolvers;
