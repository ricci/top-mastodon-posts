import { NextPage } from "next";
import { useRouter } from "next/router";
import { useMastodonAccount, useMastodonTopStatuses } from "@/hooks";
import {
	Alert,
	AlertDescription,
	AlertIcon,
	AlertTitle,
	Card,
	CardBody,
	Container,
        Box,
	Flex,
	Heading,
	Progress,
	Text,
        HStack
} from "@chakra-ui/react";
import { MastodonDisplayName, MastodonStatusEmbed, MastodonProfile, MastodonHashtag, IndexBox } from "@/components";
import Head from "next/head";
import { appName, separator } from "@/library";

const TopPosts: NextPage = () => {
	const router = useRouter();
	const accountName = router.query.account;
	const isAccountNameSet = typeof accountName === "string";
	const [, username, server] = isAccountNameSet ? accountName.split("@") : [];

	const { account } = useMastodonAccount({ server, username });

	const {
		error: statusesError,
		isLoading: isLoadingStatuses,
		progress: statusesLoadingProgress,
		topStatuses: statuses,
	        topHashtags: hashtags
	} = useMastodonTopStatuses({ server, username });

	const title = account
		? [account.display_name, separator, appName].join(" ")
		: appName;

	return (
		<>
			<Head>
				<title>{title}</title>
				<meta
					name="description"
					content={`${accountName} - Mastodon Academy`}
				/>
			</Head>

			<Container maxWidth = "container.xl">
		                <Flex direction="row">
                                    <Box flexGrow={4}>{account && <MastodonProfile account={account} tags={hashtags} />}</Box>
                                    <Box flexGrow={1}>{statuses && <IndexBox statuses={statuses} />}</Box>
	                        </Flex>
				<Flex direction="column" gap={8}>
					{isLoadingStatuses && (
						<Flex gap={4} alignItems="center">
							<Text>Loading</Text>
							<Progress
								flexGrow={1}
								height={4}
								isIndeterminate={statusesLoadingProgress === undefined}
								max={1}
								value={statusesLoadingProgress}
							/>
						</Flex>
					)}

					{statusesError && (
						<Alert status="error">
							<AlertIcon />
							<AlertTitle>Failed to get posts</AlertTitle>
							<AlertDescription>{statusesError.message}</AlertDescription>
						</Alert>
					)}

				</Flex>
			</Container>
		</>
	);
};

export default TopPosts;
