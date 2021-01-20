import { v4 as uuidv4 } from 'uuid';

import { createTransaction, NotionMarkdownConfig, NotionOperationData, TNotionBlocks } from '../src';
import { IOperation, IPage } from '@nishans/types';

export async function generateNotionBlockOperations (
	notion_data: NotionOperationData,
	notion_blocks: TNotionBlocks[],
	config: NotionMarkdownConfig
) {
	const { space_id, shard_id, user_id } = notion_data;
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

	const content_create_ops: IOperation[] = notion_blocks.map((block) => {
			const content_id = uuidv4();
			return {
				table: 'block',
				args: {
					id: content_id,
					type: 'header',
					parent_table: 'block',
					parent_id: block_id,
					properties: {
						title: [ [ block.title ] ]
					},
					...metadata
				},
				command: 'update',
				id: content_id,
				path: []
			};
		}),
		content_ids = content_create_ops.map(({ id }) => id);

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

	operations.push(...content_create_ops);

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

	return operations;
}
