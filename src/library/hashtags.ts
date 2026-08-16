import { MastodonStatus, MastodonTag } from "@/types";

export function computeTopHashtags(statuses: MastodonStatus[], count = 3): MastodonTag[] {
	const hashtagCounts = new Map<string, number>();
	const hashtagURLs = new Map<string, string>();
	const allHashtags = statuses.map(x => x.tags).flat();

	for (const element of allHashtags) {
		if (!hashtagURLs.has(element.name)) {
			hashtagURLs.set(element.name, element.url);
		}
		hashtagCounts.set(element.name, (hashtagCounts.get(element.name) ?? 0) + 1);
	}

	return Array.from(hashtagCounts.keys())
		.sort((a, b) => hashtagCounts.get(b)! - hashtagCounts.get(a)!)
		.slice(0, count)
		.map(name => ({ name, url: hashtagURLs.get(name)! }));
}
