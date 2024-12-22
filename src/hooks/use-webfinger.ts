import useSwrImmutable from "swr/immutable";

const fetcher = (accountName: string) => {

    const [username, server] = accountName.split("@");
    const req = new Request(`https://${server}/.well-known/webfinger?resource=${username}%40${server}`);
    return fetch(req).then(
        r => {
            return "https://" + new URL(r.url).host
        },
        e => {
            // If the webfinger fetch failed, we'll just fall back to the domain the username
            return "https://" + server;
        });
}

export default function useWebfinger({
        username,
	server
}: {
	username: string;
	server: string;
}) {
        let data = "https://" + server;
	const { data: newData, error, isLoading } = useSwrImmutable(
	     `${username}@${server}`, fetcher
	);
        if (newData) {
            data = server;
        }

	return {
		httpserver: data,
		error,
		isLoading,
	};
}
