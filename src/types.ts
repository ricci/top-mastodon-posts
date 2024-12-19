export interface MastodonAccount {
	id: string;
	acct: string;
	avatar: string;
	display_name: string;
        account: string;
	emojis: Array<{
		shortcode: string;
		url: string;
	}>;
	statuses_count: number;
        fields: Array<{
                name: string;
                value: string;
                verified_at?: string;
        }>;
}

export interface MastodonStatus {
	id: string;
	favourites_count: number;
}
