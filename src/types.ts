export interface MastodonTag {
    name: string;
    url: string;
}

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
        note: string;
	statuses_count: number;
        fields: Array<{
                name: string;
                value: string;
                verified_at?: string;
        }>;
        url: string;
}

export interface MastodonMediaAttachment {
        type: string;
        description: string | null;
}

export interface MastodonStatus {
	id: string;
	favourites_count: number;
	reblogs_count: number;
        created_at: Date;
        content: string;
        tags: Array<MastodonTag>;
        url: string;
        mentions: Array<{
             id: string;
             url: string;
        }>;
        media_attachments: Array<MastodonMediaAttachment>;
}

export interface CrimResponse {
        response: string;
}
