import { NextPage } from "next";
import { useRouter } from "next/router";
import { useMastodonAccount, useMastodonTopStatuses, useWebfinger } from "@/hooks";
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
import { MastodonDisplayName, MastodonStatusEmbed, MastodonProfile, MastodonHashtag, IndexBox, MastodonStatusTable } from "@/components";
import Head from "next/head";
import { appName, separator } from "@/library";

const TopPosts: NextPage = () => {
	const router = useRouter();
        const crimeMode = router.asPath.startsWith("/academic-crimes");
	const accountName = router.query.account;
	const isAccountNameSet = typeof accountName === "string";
	const [, username, server] = isAccountNameSet ? accountName.split("@") : [];

        const { httpserver } = useWebfinger({username, server});

	const { account: account, error: accountError } = useMastodonAccount({ server, username, httpserver });

	const {
		error: statusesError,
		isLoading: isLoadingStatuses,
		progress: statusesLoadingProgress,
		topStatuses: statuses,
	        topHashtags: hashtags
	} = useMastodonTopStatuses({ server, username, httpserver });

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
		                <Flex direction="row" marginBottom={10}>
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

                                {statuses && <MastodonStatusTable statuses={statuses} isLoading={isLoadingStatuses} crimeMode={crimeMode} />}
			</Container>
		</>
	);
};

export default TopPosts;
