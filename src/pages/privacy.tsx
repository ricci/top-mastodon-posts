import { NextPage } from "next";
import { Container, Flex, Heading, Text } from "@chakra-ui/react";

const Privacy: NextPage = () => (
	<>
		<Container>
			<Flex direction="column" gap={4}>
				<Heading as="h2">Privacy</Heading>

				<Text>
					This website retains no data. It has no backend, database, caching,
					logging, or analytics. All HTTP requests are made from your browser
					(aka client) to public Mastodon API endpoints with no authentication.
				</Text>
			</Flex>
		</Container>
	</>
);

export default Privacy;