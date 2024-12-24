import { useState } from "react";
import { useMastodonSearch } from "@/hooks";
import Link from "next/link";
import NextLink from "next/link";
import {
	Avatar,
        Box,
	Card,
	CardBody,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Heading,
	Input,
        IconButton,
	InputGroup,
	InputRightElement,
	Spinner,
        Radio, RadioGroup,
	Text,
        HStack,
        VStack,
        Container,
} from "@chakra-ui/react";
import { MastodonDisplayName } from "@/components";
import { useDebounce } from "react-use";
import { constants } from "@/library";
import { LuSearch } from "react-icons/lu";

import Image from "next/image";
import logo from "../../public/images/logo.svg";
import ma from "../../public/images/mastodon-academy.svg";

const mastodonDotSocial = "https://mastodon.social";
const { mastodonSearchMinimumQueryLength } = constants;
const exampleHandles = [
    "@albert@advanced.studies",
    "@idawgg@apple.orchard",
    "@richard@bongo.rip",
    "@sagan@apple.pie.from.scratch",
    "@aturing@mastodon.gay",
    "@ramanujan@mastodon.prime",
    "@ada@lovelace.place",
    "@gödel@incomple",
    "@marie@curie.rad",
    "@grace@hop.town"

];

export default function AccountSearch() {
	const [query, setQuery] = useState<string | undefined>(undefined);
	const [queryDebounced, setQueryDebounced] = useState<string | undefined>(
		undefined
	);
	const isQueryDebouncedTooShort =
		(queryDebounced?.length || Infinity) < mastodonSearchMinimumQueryLength;
	const { data, isLoading } = useMastodonSearch({
		query: queryDebounced,
		server: mastodonDotSocial,
		type: "accounts",
	});

	useDebounce(
		() => {
			setQueryDebounced(query);
		},
		500,
		[query]
	);

	return (<>
                <Container centerContent paddingTop="100px" paddingBottom="50px">
                    <NextLink href="/">
                        <Flex alignItems="center" gap={2}>
                            <Box height={8}>
                                <Image
                                    src={logo}
                                    alt="Top Mastodon Posts logo"
                                    style={{ height: "100%", width: "auto" }}
                                />
                            </Box>
                            <Heading as="h1" size="xl">
                                <Image
                                    src={ma}
                                    alt="Mastodon Academy"
                                    style={{ height: "50px", width: "auto" }}
                                />
                            </Heading>
                        </Flex>
                    </NextLink>
                </Container>

		<Flex direction="column" gap={4} width="100%">
			<form onSubmit={(event) => event.preventDefault()}>
				<FormControl isInvalid={isQueryDebouncedTooShort}>
					<InputGroup>
			                    <VStack width="100%">
			                      <HStack width="100%" gap={0}>
						<Input
							onInput={(event) =>
								setQuery((event.target as HTMLInputElement).value)
							}
							placeholder = {"e.g. " + exampleHandles[Math.floor(Math.random() * exampleHandles.length)]}
							type="search"
						/>
						{isLoading && (
							<InputRightElement pointerEvents="none">
								<Spinner size="sm" />
							</InputRightElement>
						)}
                                                <IconButton aria-label="Search for user" colorScheme="blue">
                                                  <LuSearch />
                                                </IconButton>
			                        </HStack>
                                                <RadioGroup>
                                                  <HStack direction='row'>
                                                    <Radio value='basic' defaultChecked={true}>Toots</Radio>
                                                    <Radio value='enhanced' isDisabled>Crimes</Radio>
                                                    <i>Crimes coming soon!</i>
                                                  </HStack>
                                                </RadioGroup>
			                    </VStack>
					</InputGroup>
					{isQueryDebouncedTooShort && (
						<FormErrorMessage>
							Enter at least {mastodonSearchMinimumQueryLength} characters
						</FormErrorMessage>
					)}
				</FormControl>
			</form>

			{data && (
				<Flex as="ol" direction="column" gap={4} listStyleType="none">
					{data.accounts.map((account) => {
						let [username, accountServer] = account.acct.split("@");
						accountServer = accountServer ?? mastodonDotSocial;

						const accountName = `@${username}@${accountServer}`;

						return (
							<li key={account.id}>
								<Link href={`/by/${accountName}`}>
									<Card>
										<CardBody>
											<Flex gap={2} alignItems="center">
												<Avatar
													name={account.display_name}
													src={account.avatar}
												/>
												<Flex direction="column" gap={1}>
													<Heading
														as="h2"
														size="sm"
														display="flex"
														flexDirection="row"
														alignItems="center"
														gap={1}
													>
														<MastodonDisplayName account={account} />
													</Heading>
													<Text fontSize="sm" overflowWrap="break-word">
														{accountName}
													</Text>
												</Flex>
											</Flex>
										</CardBody>
									</Card>
								</Link>
							</li>
						);
					})}
				</Flex>
			)}
		</Flex>
	</>);
}
