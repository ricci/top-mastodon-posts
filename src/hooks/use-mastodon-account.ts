import { useMastodonSearch } from "@/hooks";

export default function useMastodonAccount({
	server,
        httpserver,
	username,
}: {
	server: string | undefined;
	httpserver: string | undefined;
	username: string | undefined;
}) {
	let { data, error, isLoading } = useMastodonSearch({
		query: `@${username}@${server}`,
		server: httpserver,
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
