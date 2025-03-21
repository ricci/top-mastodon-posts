import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useMastodonAccount, useMastodonTopStatuses, useWebfinger } from "@/hooks";
import {
	Alert,
	AlertDescription,
	AlertIcon,
	AlertTitle,
        Box,
	Container,
        HStack,
	Flex,
        FormControl,
        FormLabel,
	Progress,
        Switch,
	Text,
} from "@chakra-ui/react";
import { IndexBox, MastodonProfile, MastodonStatusTable } from "@/components";
import Head from "next/head";
import { appName, separator } from "@/library";
import { LuVenetianMask } from "react-icons/lu";



const TopPosts: NextPage = () => {
	const router = useRouter();
        const [crimeMode, setCrimeMode] = useState(false);
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

        const pathCrimeMode = router.asPath.startsWith("/academic-crimes");
        if (pathCrimeMode !== crimeMode) {
            setCrimeMode(pathCrimeMode);
        }

        function handleSwitch() {
            if (router.asPath.startsWith("/academic-crimes")) {
               router.replace(router.asPath.replace("/academic-crimes/","/by/"));
            } else {
               router.replace(router.asPath.replace("/by/","/academic-crimes/"));
            }
        }

        const crimesSwitch = 
		                <FormControl display='inline-block' width='minW' alignItems='center' paddingLeft={5}>
	                          <HStack gap={0}>
                                  <FormLabel htmlFor='crime-mode' mb='0'>
                                      <LuVenetianMask />
                                  </FormLabel>
                                  <Switch id='crime-mode' isChecked={crimeMode} onChange={handleSwitch} size='sm' />
	                          </HStack>
                                </FormControl>

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

                                {statuses && <MastodonStatusTable statuses={statuses} isLoading={isLoadingStatuses} crimeMode={crimeMode} extra={crimesSwitch} />}
			</Container>
		</>
	);
};

export default TopPosts;
