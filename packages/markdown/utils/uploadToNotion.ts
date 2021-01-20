import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

import { createTransaction, NotionMarkdownConfig, NotionOperationData, TNotionBlocks } from '../src';
import { IOperation } from '@nishans/types';

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

	await axios.post(
		'https://www.notion.so/api/v3/saveTransactions',
		createTransaction(shard_id, space_id, operations),
		headers
	);
}
