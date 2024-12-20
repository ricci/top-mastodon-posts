import { NextPage } from "next";
import { Container, Flex, Heading, Text } from "@chakra-ui/react";
import { InlineLink } from "@/components";
import { apostrophe } from "@/library";

const Privacy: NextPage = () => (
	<>
		<Container>
			<Flex direction="column" gap={4}>
				<Heading as="h2">Privacy</Heading>

				<Text>
					This application retains no personal information or data. It has no
					backend, database, caching, logging, or ads. The entire
		                        application runs in your browser, and fetches only public
		                        information from Mastodon servers.
				</Text>
			</Flex>
		</Container>
	</>
);

export default Privacy;
