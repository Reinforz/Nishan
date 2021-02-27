import axios from 'axios';
import { NotionRequest } from '.';
import { NotionRequestConfigs } from '..';

const BASE_NOTION_URL = 'https://www.notion.so/api/v3';

/**
 * Sends an api request to a particular notion endpoint
 * @param endpoint The notion endpoint to send a request to
 * @param arg The payload that is to be sent along with the request
 * @param configs The notion header configs, used to set the token, user_id and the interval
 */
export const sendRequest = <T>(endpoint: string, arg: any, configs?: Partial<NotionRequestConfigs>): Promise<T> => {
	const default_configs = { interval: 500, ...configs };

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
