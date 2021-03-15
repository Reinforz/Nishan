import { NotionLogger } from '@nishans/logger';
import { INotionEndpoints } from '@nishans/types';
import axios from 'axios';
import { NotionEndpoints } from '../../libs';
import { notion_request_configs } from './utils';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('NotionRequest.send', () => {
	it(`Should work without any config passed`, async () => {
		const request_data = {
				req: 'request_data'
			},
			response_data = {
				res: 'response_data'
			},
			headers = {
				headers: {
					'x-notion-active-user-header': 'user_id',
					cookie: 'cookie'
				}
			};

		const axiosPostMock = jest.spyOn(axios, 'post').mockImplementationOnce(async () => ({ data: response_data }));
		const constructHeadersMock = jest.spyOn(NotionEndpoints.Request, 'constructHeaders').mockImplementationOnce(() => {
				return headers;
			}),
			endpointInfoLogger = jest.spyOn(NotionLogger.endpoint, 'info').mockImplementationOnce(() => undefined as any);

		const response = await NotionEndpoints.Request.send<INotionEndpoints['syncRecordValues']['response']>(
			'syncRecordValues',
			request_data,
			notion_request_configs
		);
		expect(constructHeadersMock).toHaveBeenCalledWith(notion_request_configs);
		expect(axiosPostMock).toHaveBeenCalledWith('https://www.notion.so/api/v3/syncRecordValues', request_data, headers);
		expect(response).toStrictEqual(response_data);
		expect(endpointInfoLogger).toHaveBeenCalledWith('syncRecordValues');
	});

	it(`Should respond to request error`, async () => {
		const request_data = {
				req: 'request_data'
			},
			headers = {
				headers: {
					'x-notion-active-user-header': 'user_id',
					cookie: 'cookie'
				}
			},
			endpointErrorLogger = jest.spyOn(NotionLogger.endpoint, 'error').mockImplementationOnce(() => undefined as any);

		const axiosPostMock = jest.spyOn(axios, 'post').mockImplementationOnce(async () => {
			throw new Error('Error occurred');
		});
		const constructHeadersMock = jest.spyOn(NotionEndpoints.Request, 'constructHeaders').mockImplementationOnce(() => {
			return headers;
		});

		await expect(
			NotionEndpoints.Request.send<INotionEndpoints['syncRecordValues']['response']>(
				'syncRecordValues',
				request_data,
				notion_request_configs
			)
		).rejects.toThrow(`Error occurred`);
		expect(constructHeadersMock).toHaveBeenCalledWith(notion_request_configs);
		expect(endpointErrorLogger).toHaveBeenCalledWith('Error occurred');
		expect(axiosPostMock).toHaveBeenCalledWith('https://www.notion.so/api/v3/syncRecordValues', request_data, headers);
	});
});
