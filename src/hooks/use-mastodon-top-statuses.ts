import { MastodonStatus } from "@/types";
import { useMastodonStatuses } from "@/hooks";

export default function useMastodonTopStatuses({
	server,
	username,
}: {
	server: string;
	username: string;
}) {
	const { error, isLoading, progress, statuses } = useMastodonStatuses({
		server,
		username,
	});

	let topStatuses: MastodonStatus[] | undefined = statuses;
	let topHashtags: Array<MastodonTag> | undefined;

	if (topStatuses) {
		//topStatuses = topStatuses.filter((status) => status.favourites_count > 0);
		topStatuses.sort((a, b) => b.favourites_count - a.favourites_count);

	        // Calculate H-Index for both favourites and boosts
	
	        // Find most-used hashtags
	        let hashtagCounts = new Map();
	        let hashtagURLs = new Map();
	        let allHashtags = topStatuses.map(x => x.tags).flat();
	        for (const element of allHashtags) {
	            if (! hashtagURLs.has(element.name)) {
	                hashtagURLs.set(element.name, element.url);
                    }
	            if (hashtagCounts.has(element.name)) {
	                hashtagCounts.set(element.name, hashtagCounts.get(element.name) + 1);
                    } else {
	                hashtagCounts.set(element.name, 1);
                    }
	        }
	        
	        topHashtags = Array.from(hashtagCounts.keys()).sort((a,b) => hashtagCounts.get(b) - hashtagCounts.get(a)).slice(0,3).map(function (x) { return {name: x, url: hashtagURLs.get(x)}});
		//topStatuses = topStatuses.slice(0, 20);
	}

	return { error, isLoading, progress, topStatuses, topHashtags };
}
