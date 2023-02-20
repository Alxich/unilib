import "reflect-metadata";
import { ApolloServer } from "apollo-server-micro";
import { MicroRequest } from "apollo-server-micro/dist/types";
import { ServerResponse, IncomingMessage } from "http";
import { buildSchema } from "type-graphql";

import { PostsResolver } from "../../src/schema/posts/posts.resolver";
import { CategoriesResolver } from "../../src/schema/categories/categories.resolver";
import { FandomsResolver } from "../../src/schema/fandoms/fandoms.resolver";

const schema = await buildSchema({
  resolvers: [PostsResolver, CategoriesResolver, FandomsResolver],
});

const server = new ApolloServer({ schema });

export const config = {
  api: {
    bodyParser: false,
  },
};

const startServer = server.start();

export default async function handler(
  reg: MicroRequest,
  res: ServerResponse<IncomingMessage>
) {
  await startServer;
  await server.createHandler({
    path: "/api/graphql",
  })(reg, res);
}
