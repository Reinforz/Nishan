import { v4 as uuidv4 } from 'uuid';

import { CodeNotionBlock, NotionMarkdownConfig, NotionOperationData, TNotionBlocks } from '../src';
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
			const content_id = uuidv4(),
				{ type } = block,
				common_props: any = {
					table: 'block',
					command: 'update',
					id: content_id,
					path: [],
					args: {
						id: content_id,
						type,
						properties: {},
						parent_table: 'block',
						parent_id: block_id,
						...metadata
					}
				};

			if (type !== 'divider') common_props.args.properties.title = (block as any).title;

			switch (type) {
				case 'code':
					common_props.args.properties.language = (block as CodeNotionBlock).lang;
					break;
			}

			return common_props;
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
