import { MastodonAccount } from "@/types";
import { Button, Link, Text } from "@chakra-ui/react";
import { LuMailPlus } from "react-icons/lu";

export default function MastodonFollowButton({
	account,
}: {
	account: MastodonAccount;
}) {
	return (
	<>
	   <Link href={account.url}>
               <Button leftIcon={<LuMailPlus />} colorScheme='blue'>
                    <Text>Follow</Text>
               </Button>
            </Link>
        </>
        )
}
