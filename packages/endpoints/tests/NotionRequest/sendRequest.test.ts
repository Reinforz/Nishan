import { NotionEndpoints } from '@nishans/types';
import axios from 'axios';
import { NotionRequest } from '../../libs';
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
		const constructHeadersMock = jest.spyOn(NotionRequest, 'constructHeaders').mockImplementationOnce(() => {
			return headers;
		});

		const response = await NotionRequest.send<NotionEndpoints['syncRecordValues']['response']>(
			'syncRecordValues',
			request_data,
			notion_request_configs
		);
		expect(constructHeadersMock).toHaveBeenCalledWith(notion_request_configs);
		expect(axiosPostMock).toHaveBeenCalledWith('https://www.notion.so/api/v3/syncRecordValues', request_data, headers);
		expect(response).toStrictEqual(response_data);
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
			};

		const axiosPostMock = jest.spyOn(axios, 'post').mockImplementationOnce(async () => {
			throw new Error('Error occurred');
		});
		const constructHeadersMock = jest.spyOn(NotionRequest, 'constructHeaders').mockImplementationOnce(() => {
			return headers;
		});

		await expect(
			NotionRequest.send<NotionEndpoints['syncRecordValues']['response']>(
				'syncRecordValues',
				request_data,
				notion_request_configs
			)
		).rejects.toThrow(`Error occurred`);
		expect(constructHeadersMock).toHaveBeenCalledWith(notion_request_configs);
		expect(axiosPostMock).toHaveBeenCalledWith('https://www.notion.so/api/v3/syncRecordValues', request_data, headers);
	});
});
