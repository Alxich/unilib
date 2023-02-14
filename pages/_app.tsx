import "../styles/globals.scss";
import type { AppProps } from "next/app";
import { Hydrate, QueryClientProvider } from "react-query";

import { queryClient } from "../src/api";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <Component {...pageProps} />
      </Hydrate>
    </QueryClientProvider>
  );
}
