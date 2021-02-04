import deepEqual from 'deep-equal';
import { sendRequest } from '../../src';
import { sendApiRequest, constructHeaders } from '../../utils/sendRequest';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { SyncRecordValuesResult } from '@nishans/types';

axios.defaults.baseURL = 'https://www.notion.so/api/v3';

const mock = new MockAdapter(axios);

describe('constructHeaders', () => {
	it(`Should throw an error if token not provided`, () => {
		expect(() =>
			constructHeaders({
				token: ''
			})
		).toThrow('Token not provided');
	});

	it(`Should return properly constructed header`, () => {
		expect(
			deepEqual(
				constructHeaders({
					token: 'token'
				}),
				{
					headers: {
						cookie: 'token_v2=token;notion_user_id=;',
						['x-notion-active-user-header']: ''
					}
				}
			)
		).toBe(true);

		expect(
			deepEqual(
				constructHeaders({
					token: 'token',
					user_id: '123'
				}),
				{
					headers: {
						cookie: 'token_v2=token;notion_user_id=123;',
						['x-notion-active-user-header']: '123'
					}
				}
			)
		).toBe(true);
	});
});

describe('sendApiRequest', () => {
	it('Should contain correct request url,data and response data', async () => {
		const request_data = {
				req: 'request_data'
			},
			response_data = {
				res: 'response_data'
			};
		mock.onPost('/syncRecordValues').replyOnce(200, response_data);
		const response = await sendApiRequest<SyncRecordValuesResult>('syncRecordValues', request_data, {
			token: 'token'
		});

		expect(deepEqual(JSON.parse(response.config.data), request_data)).toBe(true);
		expect(response.request.responseURL).toBe(`https://www.notion.so/api/v3/syncRecordValues`);
		expect(deepEqual(response.data, response_data)).toBe(true);
	});
});

describe('sendRequest', () => {
	it(`Should contain correct request url,data and response data with default interval`, async () => {
		const request_data = {
				req: 'request_data'
			},
			response_data = {
				res: 'response_data'
			};
		mock.onPost('/syncRecordValues').replyOnce(200, response_data);
		const response = await sendRequest<SyncRecordValuesResult>('syncRecordValues', request_data, {
			token: 'token'
		});
		expect(deepEqual(response, response_data)).toBe(true);
	});

	it(`Should contain correct request url,data and response data`, async () => {
		const request_data = {
				req: 'request_data'
			},
			response_data = {
				res: 'response_data'
			};
		mock.onPost('/syncRecordValues').replyOnce(200, response_data);
		const response = await sendRequest<SyncRecordValuesResult>('syncRecordValues', request_data, {
			token: 'token',
			interval: 500
		});
		expect(deepEqual(response, response_data)).toBe(true);
	});

	it(`Should respond to request error`, async () => {
		const request_data = {
			req: 'request_data'
		};
		mock.onPost('/syncRecordValues').networkErrorOnce();
		try {
			await sendRequest<SyncRecordValuesResult>('syncRecordValues', request_data, {
				token: 'token',
				interval: 500
			});
		} catch (err) {
			expect(err).toBeTruthy();
		}
	});
});
