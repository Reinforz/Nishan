import { NotionLogger } from '@nishans/logger';
import axios from 'axios';
import { INotionEndpointsOptions } from '..';
import { NotionEndpointsRequest } from './';

const BASE_NOTION_URL = 'https://www.notion.so/api/v3';

/**
 * Sends an api request to a particular notion endpoint
 * @param endpoint The notion endpoint to send a request to
 * @param arg The payload that is to be sent along with the request
 * @param configs The notion header configs, used to set the token, user_id and the interval
 */
export const sendRequest = <T>(endpoint: string, arg: any, configs?: INotionEndpointsOptions): Promise<T> => {
	const default_configs = { interval: 500, ...configs };

	return new Promise((resolve, reject) => {
		setTimeout(async () => {
			try {
				const headers = NotionEndpointsRequest.constructHeaders(configs);
				const response = await axios.post<T>(`${BASE_NOTION_URL}/${endpoint}`, arg, headers);
				NotionLogger.endpoint.info(endpoint);
				resolve(response.data);
			} catch (err) {
				NotionLogger.endpoint.error(err.message);
				reject(err);
			}
		}, default_configs.interval);
	});
};
