import { cache } from "@/library";
import { criminalizeURL } from "@/library/constants";
import { CrimResponse } from "@/types";
import useSwrImmutable from "swr/immutable";

export default function useCriminalizeVenue({
	post,
        wait,
        enable,
        id
}: {
	post: string;
	wait: boolean;
	enable: boolean;
        id: string;
}) {
        const fetcher = async (post: string): Promise<CrimResponse> => {
                const cached = await cache.readCrimeCache(id, "venue");
                if (cached) return cached;

                const response: CrimResponse = await fetch(criminalizeURL, {
                        method: "PUT",
                        body: JSON.stringify({ type: 'venue', message: post.replace("venue:","") }),
                        headers: { "Content-Type": "application/json" },
                }).then(r => r.json());

                await cache.writeCrimeCache(id, "venue", response);
                return response;
        };

        const { data, error, isLoading } = useSwrImmutable(
             (enable&&!wait)?("venue:" +post):undefined, fetcher
        );

        return {
                data,
                error,
                isLoading,
        };
}
