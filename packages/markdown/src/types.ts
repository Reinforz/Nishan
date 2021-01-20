export type FrontMatterKeys = 'title';

export type HeaderNotionBlock = {
	title: string;
	type: 'header';
};

export type TNotionBlocks = HeaderNotionBlock;

export interface NotionOperationData {
	shard_id: number;
	space_id: string;
	user_id: string;
	headers: {
		headers: {
			cookie: string;
			'x-notion-active-user-header': string;
		};
	};
}

export type NotionMarkdownConfig = Record<FrontMatterKeys, any>;
