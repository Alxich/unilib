import userTypeDefs from "./users";
import conversationTypeDefs from "./conversations";
import messageTypeDefs from "./messages";
import postTypeDefs from "./posts";
import categoryTypeDefs from "./categories";
import tagTypeDefs from "./tags";
import commentTypeDefs from "./comments";

const typeDefs = [
  conversationTypeDefs,
  messageTypeDefs,
  tagTypeDefs,
  postTypeDefs,
  categoryTypeDefs,
  commentTypeDefs,
  userTypeDefs,
];

export default typeDefs;
