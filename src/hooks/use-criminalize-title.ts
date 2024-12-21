import { CrimResponse } from "@/types";
import useSwrImmutable from "swr/immutable";

const fetcher = post => fetch("http://localhost:8080/criminalize", { method: "PUT", body: JSON.stringify({ type: 'title', message: post }) }).then(r => r.json())

export default function useCriminalizeTitle({
	post
}: {
	post: string;
}) {
	const { data, error, isLoading } = useSwrImmutable<{
		resp: CrimResponse;
		error?: string;
	}>(
	     post, fetcher
	);

	return {
		data,
		error,
		isLoading,
	};
}
