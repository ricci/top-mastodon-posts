import { ReactElement } from "react";
import {
	Box,
	Container,
	Flex,
	Heading,
	Show,
	Text,
	useColorModeValue,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { appName, separator } from "@/library";
import { InlineLink } from "@/components";

import Image from "next/image";
import ma from "../../public/images/mastodon-academy.svg";

export default function Layout({ children }: { children: ReactElement }) {
	const alternateBackgroundColor = useColorModeValue("gray.100", "gray.700");

	return (
		<Flex direction="column" gap={4} height="100%">
                        <Box
                            as="header"
                            paddingBottom={50}
                        >
                        <NextLink href="/"><Image src={ma} alt="Mastodon Academy" height={30} style={{ padding: "15px" }}/></NextLink>
                        </Box>
			<Box as="main" flexGrow={1} paddingY={4}>
				{children}
			</Box>

			<Box
				as="footer"
				backgroundColor={alternateBackgroundColor}
				boxShadow="base"
				paddingY={4}
			>
				<Container>
					<Flex direction={["column", "row"]} gap={4}>
						<Text>
							By{" "}
							<InlineLink href="https://www.patrikcsak.com/">
								Patrik Csak
							</InlineLink>
                                                        {" "}and{" "}
							<InlineLink href="https://ricci.io/">
								Robert Ricci
							</InlineLink>
						</Text>

						<Show above="sm">{separator}</Show>

						<InlineLink href="/how-it-works" useNextLink>
							How it works
						</InlineLink>

						<Show above="sm">{separator}</Show>

						<InlineLink href="/privacy" useNextLink>
							Privacy
						</InlineLink>
					</Flex>
				</Container>
			</Box>
		</Flex>
	);
}
