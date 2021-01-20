import { IOperation } from '@nishans/types';
import axios from 'axios';
import { NotionOperationData } from '../src';
import { createTransaction } from './createTransactions';

export async function uploadToNotion (
	{ shard_id, space_id, headers }: NotionOperationData,
	notion_block_ops: IOperation[]
) {
	await axios.post(
		'https://www.notion.so/api/v3/saveTransactions',
		createTransaction(shard_id, space_id, notion_block_ops),
		headers
	);
}
