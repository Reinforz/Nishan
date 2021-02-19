import { SyncRecordValuesResult } from '@nishans/types';
import axios from 'axios';
import { NotionRequest } from '../../src';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('NotionRequest.constructHeaders', () => {
	it(`Should return token attached header`, () => {
		expect(
			NotionRequest.constructHeaders({
				token: 'token'
			})
		).toStrictEqual({
			headers: {
				cookie: 'token_v2=token;'
			}
		});
	});

	it(`Should return user_id attached header`, () => {
		expect(
			NotionRequest.constructHeaders({
				user_id: '123'
			})
		).toStrictEqual({
			headers: {
				cookie: 'notion_user_id=123;',
				['x-notion-active-user-header']: '123'
			}
		});
	});

	it(`Should return token+user_id attached header`, () => {
		expect(
			NotionRequest.constructHeaders({
				user_id: '123',
				token: 'token'
			})
		).toStrictEqual({
			headers: {
				cookie: 'token_v2=token;notion_user_id=123;',
				['x-notion-active-user-header']: '123'
			}
		});
	});

	it(`Should return empty header`, () => {
		expect(NotionRequest.constructHeaders({})).toStrictEqual({
			headers: {}
		});
	});

	it(`Should return empty header when nothing is passed`, () => {
		expect(NotionRequest.constructHeaders()).toStrictEqual({
			headers: {}
		});
	});
});

describe('NotionRequest.send', () => {
	it(`Should work without any config passed`, async () => {
		const request_data = {
				req: 'request_data'
			},
			response_data = {
				res: 'response_data'
			},
			notion_request_configs = {
				token: 'cookie',
				user_id: 'user_id'
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

		const response = await NotionRequest.send<SyncRecordValuesResult>(
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
			notion_request_configs = {
				token: 'cookie',
				user_id: 'user_id'
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
			NotionRequest.send<SyncRecordValuesResult>('syncRecordValues', request_data, notion_request_configs)
		).rejects.toThrow(`Error occurred`);
		expect(constructHeadersMock).toHaveBeenCalledWith(notion_request_configs);
		expect(axiosPostMock).toHaveBeenCalledWith('https://www.notion.so/api/v3/syncRecordValues', request_data, headers);
	});
});

it('createTransaction', () => {
	const transactions = NotionRequest.createTransaction(123, 'space_id', []);
	const data = JSON.parse(JSON.stringify(transactions));
	expect(data.transactions[0]).toEqual(
		expect.objectContaining({
			id: expect.any(String),
			shardId: 123,
			spaceId: 'space_id',
			operations: expect.any(Array)
		})
	);
});
