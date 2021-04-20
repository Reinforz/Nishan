export interface ICreateBookmarkRowsParams {
	dev_to_cookie: string;
	notion_cookie: string;
	title?: string;
	parent_id: string;
	parent_table: 'collection' | 'block' | 'space';
	space_id: string;
	shard_id: number;
	user_id: string;
}
