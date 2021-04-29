import { IOperation } from '@nishans/types';
import axios from 'axios';
import { NotionOperationData } from '../src';
import { createTransaction } from './createTransactions';

export async function uploadToNotion(
  { space_id, headers }: NotionOperationData,
  notion_block_ops: IOperation[]
) {
  await axios.post(
    'https://www.notion.so/api/v3/saveTransactions',
    createTransaction(space_id, notion_block_ops),
    headers
  );
}
