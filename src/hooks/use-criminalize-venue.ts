import { CrimResponse } from "@/types";
import useSwrImmutable from "swr/immutable";

const fetcher = post => fetch("http://localhost:8080/criminalize", { method: "PUT", body: JSON.stringify({ type: 'venue', message: post }) }).then(r => r.json())

export default function useCriminalizeVenue({
	post
}: {
	post: string;
}) {
	const { data, error, isLoading } = useSwrImmutable<{
		resp: CrimResponse;
		error?: string;
	}>(
	     "venue " +post, fetcher
	);

	return {
		data,
		error,
		isLoading,
	};
}
