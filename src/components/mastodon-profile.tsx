import { MastodonAccount, MastodonTag } from "@/types";
import {
    Box,
    Heading,
    HStack, VStack,
    Text
} from "@chakra-ui/react";
import parse from 'html-react-parser';
import { MastodonDisplayName, MastodonProfileImage, MastodonFollowButton, MastodonHashtag } from "@/components";

export default function MastodonProfile({
    account,
    tags
}: {
    account: MastodonAccount;
    tags: Array<MastodonTag> | undefined;
}) {
    return(
        <HStack>
            <MastodonProfileImage account={account} />
            <VStack align="left">
                <Heading size='md' display="flex" justifyContent = "space-between">
                    <Box display = "flex"><MastodonDisplayName account={account}/></Box>
                    <Box display = "flex"><MastodonFollowButton account = {account} /></Box>
                </Heading>

                <Box>{parse(account.note)}</Box>
                {account.fields.filter((x) => x.verified_at).map((x) => <Text>Verified {x.name} at {parse(x.value)}</Text>)}
                <HStack>{tags && tags.map(t => <MastodonHashtag tag={t}/>)}</HStack>
            </VStack>
        </HStack>
    );
}
