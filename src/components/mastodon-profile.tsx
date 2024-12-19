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
        <Box>
            <HStack>
                <MastodonProfileImage account={account} />
                <Box>
                    <VStack align="left">
                        <Heading size='md'><MastodonDisplayName account={account}/></Heading>
                    
                        <Box>{parse(account.note)}</Box>
                        {account.fields.filter((x) => x.verified_at).map((x) => <Text>Verified {x.name} at {parse(x.value)}</Text>)}
                        <MastodonFollowButton 
                            account = {account}
                        />
                    </VStack>
                </Box>
            </HStack>
        </Box>
    );
}
