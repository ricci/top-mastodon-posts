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
                                        backend (except for the <i>Crimes</i> feature), database, caching, logging,
                                        or ads. The entire application runs in your browser, and fetches only
                                        public information from Mastodon servers.
				</Text>

				<Heading as="h2">Crimes</Heading>

				<Text>
					The <i>crimes</i> feature is the only feature that sends information to
		                        my servers (a machine running in my closet). This feature sends only
		                        the text of (public) posts, and this text is not stored or used to
		                        train any AIs. The string sent does not including any information about
		                        the account posted it or any other metadata. I do cache a hash of the
		                        text, and the generated response, to save the time and computational
		                        power of re-generating it if you reload the page.
				</Text>

				<Heading as="h2">Hashtags</Heading>

				<Text>
					This site respects the &quot;nobot&quot; hashtag and refuses accounts that 
		                        have it in their profile descriptions.
				</Text>
			</Flex>
		</Container>
	</>
);

export default Privacy;
