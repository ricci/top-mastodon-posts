import { MastodonAccount } from "@/types";
import useSwrImmutable from "swr/immutable";

export default function useSearchMastodon({
	query,
	server,
	type,
}: {
	query: string | undefined;
	server: string | undefined;
	type: "accounts";
}) {
	const shouldSearch = (query?.length ?? 0) >= 5 && server !== undefined;
	const { data, error, isLoading } = useSwrImmutable<{
		accounts: MastodonAccount[];
		error?: string;
	}>(
		shouldSearch
			? `${server}/api/v2/search?q=${query}&type=${type}`
			: null
	);

	return {
		data,
		error,
		isLoading,
	};
}
