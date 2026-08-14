import { cache } from "@/library";
import { criminalizeURL } from "@/library/constants";
import { CrimResponse } from "@/types";
import useSwrImmutable from "swr/immutable";

export default function useCriminalizeTitle({
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
                const cached = await cache.readCrimeCache(id, "title");
                if (cached) return cached;

                const response: CrimResponse = await fetch(criminalizeURL, {
                        method: "PUT",
                        body: JSON.stringify({ type: 'title', message: post }),
                        headers: { "Content-Type": "application/json" },
                }).then(r => r.json());

                await cache.writeCrimeCache(id, "title", response);
                return response;
        };

        const { data, error, isLoading } = useSwrImmutable(
             (enable&&!wait)?post:undefined, fetcher
        );

        return {
                data,
                error,
                isLoading,
        };
}
