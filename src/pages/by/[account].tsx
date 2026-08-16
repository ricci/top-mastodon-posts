import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState, useEffect, useCallback } from "react";
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
        IconButton,
        Link,
	Progress,
        Switch,
	Text,
        Tooltip,
        VStack,
} from "@chakra-ui/react";
import { IndexBox, MastodonProfile, MastodonStatusTable } from "@/components";
import Head from "next/head";
import { appName, constants, separator } from "@/library";
import { LuVenetianMask, LuRefreshCw } from "react-icons/lu";



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
	        topHashtags: hashtags,
	        rateLimited: statusesRateLimited,
	        refresh: refreshStatuses
	} = useMastodonTopStatuses({ server, username, httpserver });

	const title = account
		? [account.display_name, separator, appName].join(" ")
		: appName;

        const pathCrimeMode = router.asPath.startsWith("/academic-crimes");
        if (pathCrimeMode !== crimeMode) {
            setCrimeMode(pathCrimeMode);
        }

        const [crimeStatusById, setCrimeStatusById] = useState<Record<string, { loading: boolean; error: boolean }>>({});

        useEffect(() => {
            setCrimeStatusById({});
        }, [statuses]);

        const handleCrimeStatus = useCallback((id: string, status: { loading: boolean; error: boolean }) => {
            setCrimeStatusById(prev => ({ ...prev, [id]: status }));
        }, []);

        const crimeStatuses = Object.values(crimeStatusById);
        const crimeTotal = statuses ? Math.min(statuses.length, constants.maxDisplayedStatuses) : 0;
        const crimeDoneCount = crimeStatuses.filter(s => !s.loading).length;
        const crimeErrorCount = crimeStatuses.filter(s => s.error).length;
        const isCrimesLoading = crimeMode && !isLoadingStatuses && crimeTotal > 0 && crimeDoneCount < crimeTotal;

        function handleSwitch() {
            if (router.asPath.startsWith("/academic-crimes")) {
               router.replace(router.asPath.replace("/academic-crimes/","/by/"));
            } else {
               router.replace(router.asPath.replace("/by/","/academic-crimes/"));
            }
        }

        const crimesSwitch =
		                <FormControl display='inline-block' width='minW' alignItems='center' paddingLeft={5}>
	                          <Tooltip label="Uses an LLM to commit academic crimes and make your toots sound serious. See How it Works and Privacy for details.">
	                          <HStack gap={0}>
                                  <FormLabel htmlFor='crime-mode' mb='0'>
                                      <LuVenetianMask />
                                  </FormLabel>
                                  <Switch id='crime-mode' isChecked={crimeMode} onChange={handleSwitch} size='sm' />
	                          </HStack>
	                          </Tooltip>
                                </FormControl>

        const titleExtra =
                                <HStack gap={5} display="inline-flex" verticalAlign="middle">
                                    {crimesSwitch}
                                    <Tooltip label="Force refresh: re-fetch this account's posts instead of using the cached copy (cache expires after a week)">
                                        <IconButton
                                            aria-label="Force refresh"
                                            variant="ghost"
                                            size="xs"
                                            isDisabled={isLoadingStatuses}
                                            onClick={refreshStatuses}
                                        >
                                            <LuRefreshCw />
                                        </IconButton>
                                    </Tooltip>
                                </HStack>

        const crimesStatus = crimeMode && (isCrimesLoading || crimeErrorCount > 0) && (
                                <VStack align="stretch" gap={1}>
                                    {isCrimesLoading && (
                                        <Flex gap={4} alignItems="center">
                                            <Text>🚨 crimes in progress</Text>
                                            <Progress
                                                flexGrow={1}
                                                height={4}
                                                max={1}
                                                value={crimeDoneCount / crimeTotal}
                                            />
                                        </Flex>
                                    )}
                                    {crimeErrorCount > 0 && (
                                        <Text fontSize="sm" color="orange.500">
                                            ⚖️ {crimeErrorCount} post{crimeErrorCount === 1 ? "" : "s"} beat the rap on a technicality — tell <Link href="https://discuss.systems/@ricci" target="_blank" textDecoration="underline">@ricci@discuss.systems</Link> the GPU in his closet needs some attention.
                                        </Text>
                                    )}
                                </VStack>
                                );

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

					{!isLoadingStatuses && statusesRateLimited && (
						<Alert status="warning">
							<AlertIcon />
							<AlertDescription>Older posts could not be fetched due to rate limits.</AlertDescription>
						</Alert>
					)}

					{statusesError && (
						<Alert status="error">
							<AlertIcon />
							<AlertTitle>Failed to get posts</AlertTitle>
							<AlertDescription>{statusesError.message}</AlertDescription>
						</Alert>
					)}

				</Flex>

                                {statuses && <MastodonStatusTable statuses={statuses} isLoading={isLoadingStatuses} crimeMode={crimeMode} extra={titleExtra} crimesProgress={crimesStatus} onCrimeStatus={handleCrimeStatus} />}
			</Container>
		</>
	);
};

export default TopPosts;
