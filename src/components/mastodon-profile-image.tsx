import { MastodonAccount } from "@/types";
import { Avatar, Link } from "@chakra-ui/react";

export default function MastodonProfileImage({
	account,
}: {
	account: MastodonAccount;
}) {
	return (
	<>
	   <Link href={account.url}>
               <Avatar
                name = {account.display_name}
                src = {account.avatar}
                size = '2xl'
               />
           </Link>
        </>
        )
}
