import { criminalizeURL } from "@/library/constants";
import useSwrImmutable from "swr/immutable";

const fetcher = (bio: string) => fetch(criminalizeURL, { method: "PUT", body: JSON.stringify({ type: 'bio', message: bio.replace("Bio:","")}), headers: { "Content-Type": "application/json" } }).then(r => r.json())

export default function useCriminalizeBio({
	bio,
        enable
}: {
	bio: string;
	enable: boolean;
}) {
        const { data, error, isLoading } = useSwrImmutable(
             (enable)?("Bio:" +bio):undefined, fetcher
        );

        return {
                data,
                error,
                isLoading,
        };
}
