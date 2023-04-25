import "../styles/globals.scss";
import type { AppProps } from "next/app";

// Apollo staff
import { ApolloProvider } from "@apollo/client";
import { client } from "../graphql/apollo-client";

// Nextauth staff
import { SessionProvider } from "next-auth/react";
import { Content } from "../components";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <ApolloProvider client={client}>
      <SessionProvider session={session}>
        <Content>
          <Component {...pageProps} />
        </Content>
      </SessionProvider>
    </ApolloProvider>
  );
}
