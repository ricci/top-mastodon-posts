import { useMastodonSearch } from "@/hooks";

export default function useMastodonAccount({
	server,
	username,
}: {
	server: string | undefined;
	username: string | undefined;
}) {
	let { data, error, isLoading } = useMastodonSearch({
		query: `@${username}@${server}`,
		server,
		type: "accounts",
	});

        // Crude #nobot check
        let acct = data?.accounts?.[0];
        const regex = new RegExp('nobot');
        if (acct && regex.test(acct.note)) {
            error = { message: "This account has requested #nobot" };
            acct = undefined;
        }
	return { account: acct, error: error, isLoading };
}
