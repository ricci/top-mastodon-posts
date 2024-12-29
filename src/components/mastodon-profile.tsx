import { MastodonAccount, MastodonTag } from "@/types";
import {
    Box,
    Heading,
    HStack, VStack,
    Text
} from "@chakra-ui/react";
import parse from 'html-react-parser';
import { MastodonDisplayName, MastodonProfileImage, MastodonFollowButton, MastodonHashtag } from "@/components";
import { useCriminalizeBio } from "@/hooks";

export default function MastodonProfile({
    account,
    tags,
    crimeMode
}: {
    account: MastodonAccount;
    tags: Array<MastodonTag> | undefined;
    crimeMode: boolean;
}) {
    const { data: crimBio } = useCriminalizeBio({ bio: account.note, enable: crimeMode });
    return(
        <HStack>
            <MastodonProfileImage account={account} />
            <VStack align="left">
                <Heading size='md' display="flex" justifyContent = "space-between">
                    <Box display = "flex"><MastodonDisplayName account={account}/></Box>
                    <Box display = "flex"><MastodonFollowButton account = {account} /></Box>
                </Heading>

                <Box>{
                    crimBio?parse(crimBio.response):parse(account.note)
                }</Box>
                {account.fields.filter((x) => x.verified_at).map((x) => <Text key={x.name}>Verified {x.name} at {parse(x.value)}</Text>)}
                <HStack>{tags && tags.map(t => <MastodonHashtag key={t.name} tag={t}/>)}</HStack>
            </VStack>
        </HStack>
    );
}
