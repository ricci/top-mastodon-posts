import { MastodonStatus } from "@/types";
import ky, { SearchParamsOption } from "ky";
import { useEffect, useState } from "react";
import useMastodonAccount from "./use-mastodon-account";

const limit = 40;

export default function useMastodonStatuses({
	server,
        httpserver,
	username,
}: {
	server: string | undefined;
	httpserver: string | undefined;
	username: string | undefined;
}) {
	const { account, error: accountError } = useMastodonAccount({
		server,
		username,
	});
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [statuses, setStatuses] = useState<MastodonStatus[] | undefined>(
		undefined
	);
	useEffect(() => {
		async function getStatuses() {
			if (!account) return;

			setIsLoading(true);

			let maxId: string | undefined = undefined;
			let moreStatuses: MastodonStatus[];
			let shouldGetMore = true;

			while (shouldGetMore) {
				const searchParams: SearchParamsOption = {
					exclude_reblogs: 1,
		                        exclude_replies: 1,
					limit,
				};

				if (maxId) searchParams.max_id = maxId;

				moreStatuses = await ky(
					`${httpserver}/api/v1/accounts/${account.id}/statuses`,
					{
						searchParams,
					}
				).json<MastodonStatus[]>();

				setStatuses((statuses) => [...(statuses ?? []), ...moreStatuses]);

				shouldGetMore = moreStatuses.length === limit;
				if (shouldGetMore) maxId = moreStatuses[moreStatuses.length - 1].id;
			}

			setIsLoading(false);
		}

		getStatuses();
	}, [account, server]);

	const [progress, setProgress] = useState<number | undefined>(undefined);
	useEffect(() => {
		if (account && statuses) {
			setProgress(isLoading ? statuses.length / account.statuses_count : 1);
		}
	}, [account, isLoading, statuses]);

	return { error: accountError, isLoading, progress, statuses };
}
