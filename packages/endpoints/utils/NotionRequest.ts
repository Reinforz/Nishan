import { IOperation, SaveTransactionParams } from '@nishans/types';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { NotionHeaders, NotionRequestConfigs } from '../src';

const BASE_NOTION_URL = 'https://www.notion.so/api/v3';

/**
 * Construct notion specific headers using the configs passed
 * @param configs Notion specific data required to construct the header
 * @returns Notion specific header
 */
function constructNotionHeaders (configs?: Partial<NotionRequestConfigs>): NotionHeaders {
	const headers: NotionHeaders = {
		headers: {}
	} as any;

	if (configs?.token) headers.headers.cookie = `token_v2=${configs.token};`;
	if (configs?.user_id) {
		if (!headers.headers.cookie) headers.headers.cookie = '';
		headers.headers.cookie += `notion_user_id=${configs.user_id};`;
		headers.headers['x-notion-active-user-header'] = configs.user_id;
	}

	return headers;
}

const sendRequest = <T>(
	endpoint: string,
	arg: any,
	configs?: Partial<NotionRequestConfigs>
): Promise<T> => {
  const default_configs = {interval: 500, ...configs};
  
	return new Promise((resolve, reject) => {
		setTimeout(async () => {
			try {
        const headers = NotionRequest.constructHeaders(configs);
				const response = await axios.post<T>(`${BASE_NOTION_URL}/${endpoint}`, arg, headers);
				resolve(response.data);
			} catch (err) {
				reject(err);
			}
		}, default_configs.interval);
	});
};

function createTransaction (shardId: number, spaceId: string, operations: IOperation[]) {
	return {
		requestId: uuidv4(),
		transactions: [
			{
				id: uuidv4(),
				shardId,
				spaceId,
				operations
			}
		]
	} as SaveTransactionParams;
}

export const NotionRequest = {
  send: sendRequest,
  constructHeaders: constructNotionHeaders,
  createTransaction
}