import { MastodonStatus } from "@/types";
import { cache, constants } from "@/library";
import ky, { HTTPError, SearchParamsOption } from "ky";
import { useCallback, useEffect, useRef, useState } from "react";
import useMastodonAccount from "./use-mastodon-account";

const limit = 40;

export default function useMastodonStatuses({
	server,
	username,
        httpserver,
}: {
	server: string | undefined;
	username: string | undefined;
	httpserver: string | undefined;
}) {

	const { account, error: accountError } = useMastodonAccount({
	        httpserver,
		server,
		username,
	});
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [statuses, setStatuses] = useState<MastodonStatus[] | undefined>(
		undefined
	);

	const [refreshNonce, setRefreshNonce] = useState(0);
	const bypassCacheRef = useRef(false);
	const [progress, setProgress] = useState<number | undefined>(undefined);
	const [rateLimited, setRateLimited] = useState(false);
	const [fetchError, setFetchError] = useState<Error | undefined>(undefined);

	useEffect(() => {
		if (!account || !server || !username) return;

		let cancelled = false;
		setStatuses(undefined);
		setProgress(undefined);
		setRateLimited(false);
		setFetchError(undefined);

		async function getStatuses() {
			const bypassCache = bypassCacheRef.current;
			bypassCacheRef.current = false;

			if (bypassCache) {
				await cache.clearStatusCache(server!, username!);
			} else {
				const cached = await cache.readStatusCache(server!, username!);
				if (cancelled) return;
				if (cached) {
					setStatuses(cached);
					return;
				}
			}

			setIsLoading(true);

			let maxId: string | undefined = undefined;
			let moreStatuses: MastodonStatus[];
			let shouldGetMore = true;
			let collected: MastodonStatus[] = [];
			let hitRateLimit = false;

			while (shouldGetMore) {
				const searchParams: SearchParamsOption = {
					exclude_reblogs: 1,
		                        exclude_replies: 1,
					limit,
				};

				if (maxId) searchParams.max_id = maxId;

				try {
					moreStatuses = await ky(
						`${httpserver}/api/v1/accounts/${account.id}/statuses`,
						{
							searchParams,
						}
					).json<MastodonStatus[]>();
				} catch (err) {
					if (cancelled) return;

					if (err instanceof HTTPError && err.response.status === 429) {
						hitRateLimit = true;
						break;
					}

					throw err;
				}

				if (cancelled) return;

				collected = [...collected, ...moreStatuses];
				setStatuses(collected);

				shouldGetMore = moreStatuses.length === limit;
				if (shouldGetMore) maxId = moreStatuses[moreStatuses.length - 1].id;
			}

			if (cancelled) return;

			if (hitRateLimit) {
				setRateLimited(true);
				setIsLoading(false);
				return;
			}

			const shown = [...collected]
				.sort((a, b) => b.reblogs_count - a.reblogs_count)
				.slice(0, constants.maxDisplayedStatuses);
			await cache.writeStatusCache(server!, username!, shown);
			if (cancelled) return;
			setIsLoading(false);
		}

		getStatuses().catch((err) => {
			if (cancelled) return;
			setFetchError(err);
			setIsLoading(false);
		});

		return () => {
			cancelled = true;
		};
	}, [account, server, httpserver, username, refreshNonce]);

	const refresh = useCallback(() => {
		bypassCacheRef.current = true;
		setRefreshNonce((n) => n + 1);
	}, []);

	useEffect(() => {
		if (account && statuses) {
			setProgress(isLoading ? statuses.length / account.statuses_count : 1);
		}
	}, [account, isLoading, statuses]);

	return { error: accountError ?? fetchError, isLoading, progress, statuses, rateLimited, refresh };
}
