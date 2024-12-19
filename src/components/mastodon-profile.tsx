import { MastodonAccount } from "@/types";
import {
    Card, CardHeader, CardBody,
    HStack, Box,
    Heading,
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
                <Card>
                    <CardHeader>
                        <Heading size='md'><MastodonDisplayName account={account}/></Heading>
                    </CardHeader>
                    <CardBody>
                        <Box>{parse(account.note)}</Box>
                        {account.fields.filter((x) => x.verified_at).map((x) => <Text>Verified {x.name} at {parse(x.value)}</Text>)}
                        <MastodonFollowButton 
                            account = {account}
                        />
                    </CardBody>
                </Card>
            </HStack>
        </Box>
    );
}
