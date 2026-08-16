import { MastodonStatus, RankingMetric } from "@/types";

export function metricCount(status: MastodonStatus, metric: RankingMetric): number {
	return metric === "boosts" ? status.reblogs_count : status.favourites_count;
}

export function metricTooltip(metric: RankingMetric): string {
	const other = metric === "boosts" ? "favorites" : "boosts";
	return `Called "${metric}" by boring people. Click to switch to ${other}.`;
}
