import { MastodonStatus, MastodonTag } from "@/types";
import { computeTopHashtags } from "@/library";
import { useMastodonStatuses } from "@/hooks";

export default function useMastodonTopStatuses({
	server,
	username,
        httpserver,
}: {
	server: string;
	username: string;
	httpserver: string | undefined;
}) {
	const { error, isLoading, progress, statuses, cachedHashtags, rateLimited, refresh } = useMastodonStatuses({
		server,
		username,
	        httpserver
	});

	let topStatuses: MastodonStatus[] | undefined = statuses;
	let topHashtags: Array<MastodonTag> | undefined;

	if (cachedHashtags) {
		topHashtags = cachedHashtags;
	} else if (topStatuses) {
		//topStatuses = topStatuses.filter((status) => status.favourites_count > 0);
		//topStatuses.sort((a, b) => b.reblogs_count - a.reblogs_count);

	        topHashtags = computeTopHashtags(topStatuses);
		//topStatuses = topStatuses.slice(0, 20);
	}

	return { error, isLoading, progress, topStatuses, topHashtags, rateLimited, refresh };
}
