import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

import { createTransaction, NotionMarkdownConfig, NotionOperationData, TNotionBlocks } from '../src';
import { IOperation, IPage } from '@nishans/types';

export async function uploadToNotion (
	notion_data: NotionOperationData,
	notion_blocks: TNotionBlocks[],
	config: NotionMarkdownConfig
) {
	const { space_id, headers, shard_id, user_id } = notion_data;
	const metadata = {
		alive: true,
		created_time: Date.now(),
		created_by_id: user_id,
		created_by_table: 'notion_user',
		last_edited_time: Date.now(),
		last_edited_by_table: 'notion_user',
		last_edited_by_id: user_id,
		space_id,
		shard_id,
		version: 0
	};
	const operations: IOperation[] = [];
	const block_id = uuidv4();

	const content_ids = notion_blocks.map((block) => uuidv4());

	operations.push({
		command: 'update',
		table: 'block',
		id: block_id,
		path: [],
		args: {
			id: block_id,
			type: 'page',
			content: content_ids,
			parent_id: space_id,
			parent_table: 'space',
			properties: {
				title: [ [ config.title ] ]
			},
			permissions: [
				{
					role: 'editor',
					type: 'user_permission',
					user_id
				}
			],
			format: {
				page_full_width: true
			},
			...metadata
		} as IPage
	});
	operations.push({
		command: 'listAfter',
		table: 'space',
		id: space_id,
		path: [ 'pages' ],
		args: {
			after: '',
			id: block_id
		}
	});

	await axios.post(
		'https://www.notion.so/api/v3/saveTransactions',
		createTransaction(shard_id, space_id, operations),
		headers
	);
}
