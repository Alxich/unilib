import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import { getSession } from "next-auth/react";

// Create a WebSocket link for subscriptions
const wsLink =
  typeof window !== "undefined"
    ? new GraphQLWsLink(
        createClient({
          url: "ws://localhost:4000/graphql/subscriptions", // WebSocket URL for subscriptions
          connectionParams: async () => ({
            session: await getSession(), // Get the session for authentication
          }),
        })
      )
    : null;

// Create an HTTP link for queries and mutations
const httpLink = new HttpLink({
  uri: `http://localhost:4000/graphql`, // HTTP URL for queries and mutations
  credentials: "include", // Include cookies with requests for authentication
});

// Combine WebSocket and HTTP links based on the environment
const link =
  typeof window !== "undefined" && wsLink != null
    ? split(
        ({ query }) => {
          const def = getMainDefinition(query);
          return (
            def.kind === "OperationDefinition" &&
            def.operation === "subscription"
          );
        },
        wsLink,
        httpLink
      )
    : httpLink;

// Create an Apollo client with the selected link and cache configuration
export const client = new ApolloClient({
  link,
  cache: new InMemoryCache({
    addTypename: false, // Disable automatic addition of __typename fields
  }),
});