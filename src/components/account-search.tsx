import { useState } from "react";
import { useMastodonSearch } from "@/hooks";
import Link from "next/link";
import {
	Avatar,
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
        Container
} from "@chakra-ui/react";
import { MastodonDisplayName } from "@/components";
import { useDebounce } from "react-use";
import { constants } from "@/library";
import { LuSearch } from "react-icons/lu";

const mastodonDotSocial = "mastodon.social";
const { mastodonSearchMinimumQueryLength } = constants;
const exampleHandles = [
    "@albert@advanced.studies",
    "@idawgg@apple.orchard",
    "@richard@bongo.rip",
    "@sagan@apple.pie.from.scratch"
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

	return (
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
                                                    <Radio value='basic'>Toots</Radio>
                                                    <Radio value='enhanced'>Crimes</Radio>
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
	);
}
