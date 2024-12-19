import { MastodonAccount } from "@/types";
import {
    Box,
    Heading,
    HStack, VStack,
    Text
} from "@chakra-ui/react";
import parse from 'html-react-parser';
import { MastodonDisplayName, MastodonProfileImage, MastodonFollowButton } from "@/components";

export default function MastodonProfile({
    account,
}: {
    account: MastodonAccount;
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
            </VStack>
        </HStack>
    );
}
