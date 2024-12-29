import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { Analytics } from "@vercel/analytics/react";
import { Layout } from "@/components";
import { swrFetcher, theme } from "@/library";
import { SWRConfig } from "swr";

import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<ChakraProvider resetCSS theme={theme}>
				<SWRConfig
					value={{
						fetcher: swrFetcher,
					}}
				>
					<Layout>
						<Component {...pageProps} />
					</Layout>
				</SWRConfig>
			</ChakraProvider>
		</>
	);
}
