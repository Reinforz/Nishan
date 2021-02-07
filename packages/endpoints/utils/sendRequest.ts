import axios from 'axios';

import { Configs, NotionHeaders } from '../src';

const BASE_NOTION_URL = 'https://www.notion.so/api/v3';

/**
 * Construct notion specific headers using the configs passed
 * @param configs Notion specific data required to construct the header
 * @returns Notion specific header
 */
export function constructNotionHeaders (configs?: Partial<Configs>): NotionHeaders {
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

/**
 * Sends and returns a notion request
 * @param endpoint The endpoint to send the request to
 * @param arg The body required to pass alongside the request
 * @param configs The config required to construct notion header
 * @returns
 */
export function sendApiRequest<T> (endpoint: string, arg: any, configs?: Partial<Configs>) {
	const headers = constructNotionHeaders(configs);
	return axios.post<T>(`${BASE_NOTION_URL}/${endpoint}`, arg, headers);
}

export const sendRequest = <T>(
	endpoint: string,
	arg: any,
	configs?: Partial<Configs>
): Promise<T> => {
  configs = configs ?? { interval: 500 };

	return new Promise((resolve, reject) => {
		setTimeout(async () => {
			try {
				const response = await sendApiRequest<T>(endpoint, arg, configs);
				resolve(response.data);
			} catch (err) {
				reject(err);
			}
		}, (configs as any).interval);
	});
};
