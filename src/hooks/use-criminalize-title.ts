import { criminalizeURL } from "@/library/constants";
import { CrimResponse } from "@/types";
import useSwrImmutable from "swr/immutable";

const fetcher = (post: string) => fetch(criminalizeURL, { method: "PUT", body: JSON.stringify({ type: 'title', message: post }), headers: { "Content-Type": "application/json" } }).then(r => r.json())

export default function useCriminalizeTitle({
	post,
        wait,
        enable
}: {
	post: string;
	wait: boolean;
	enable: boolean;
}) {
        const { data, error, isLoading } = useSwrImmutable(
             (enable&&!wait)?post:undefined, fetcher
        );

        return {
                data,
                error,
                isLoading,
        };
}
