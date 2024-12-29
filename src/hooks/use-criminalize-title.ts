import { criminalizeURL } from "@/library/constants";
import { CrimResponse } from "@/types";
import useSwrImmutable from "swr/immutable";

const fetcher = post => fetch(criminalizeURL, { method: "PUT", body: JSON.stringify({ type: 'title', message: post }), headers: { "Content-Type": "application/json" } }).then(r => r.json())

export default function useCriminalizeTitle({
	post,
        wait
}: {
	post: string;
	wait: boolean;
}) {
        if (!wait) {
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
        } else {
            return {
                    data: undefined,
                    error: undefined,
                    isLoading: false
            };
        }
}
