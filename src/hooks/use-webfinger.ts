import useSwrImmutable from "swr/immutable";

const fetcher = (accountName: string) => {

    const [username, server] = accountName.split("@");
    const req = new Request(`https://${server}/.well-known/webfinger?resource=${username}%40${server}`);
    return fetch(req).then(r => {
        return "https://" + new URL(r.url).host}, e => { return e});
}

export default function useWebfinger({
        username,
	server
}: {
	username: string;
	server: string;
}) {
	const { data, error, isLoading } = useSwrImmutable(
	     `${username}@${server}`, fetcher
	);

	return {
		httpserver: data,
		error,
		isLoading,
	};
}
