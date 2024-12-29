import { AccountSearch } from "@/components";
import Head from "next/head";
import { Container, Text, VStack } from "@chakra-ui/react";
import { apostrophe, appName } from "@/library";

const description = `Stand on the shoulders of pachyderms`;

export default function Home() {
	return (
		<>
			<Head>
				<title>{appName}</title>
				<meta name="description" content={description} />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>

			<Container>
				<VStack align="center" gap={16}>
					<AccountSearch />
					<Text as="b" color="green">{description}</Text>
				</VStack>
			</Container>
		</>
	);
}
