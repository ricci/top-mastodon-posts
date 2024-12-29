import { criminalizeURL } from "@/library/constants";
import { CrimResponse } from "@/types";
import useSwrImmutable from "swr/immutable";

const fetcher = post => fetch(criminalizeURL, { method: "PUT", body: JSON.stringify({ type: 'venue', message: post.replace("venue:","")}), headers: { "Content-Type": "application/json" } }).then(r => r.json())

export default function useCriminalizeVenue({
	post,
        wait,
        enable
}: {
	post: string;
	wait: boolean;
	enable: boolean;
}) {
        const { data, error, isLoading } = useSwrImmutable<{
                resp: CrimResponse;
                error?: string;
        }>(
             (enable&&!wait)?("venue:" +post):undefined, fetcher
        );

        return {
                data,
                error,
                isLoading,
        };
}
