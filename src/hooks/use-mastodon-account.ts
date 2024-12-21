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


        // Check to see if there is a different server that hosts the actual API
        let httpserver: string = "";
        fetch("https://{server}/.well-known/webfinger",{redirect: "follow"}).then((response) => {
            if (response.redirected) {
                httpserver = response.url;
            } else {
                httpserver = "https://{server}";
            }
        });
	return { account: acct, error: error, httpserver: httpserver, isLoading };
}
