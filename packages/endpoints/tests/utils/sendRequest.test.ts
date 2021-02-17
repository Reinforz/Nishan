import { sendRequest } from '../../src';
import { sendApiRequest, constructNotionHeaders } from '../../utils/sendRequest';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { SyncRecordValuesResult } from '@nishans/types';

axios.defaults.baseURL = 'https://www.notion.so/api/v3';

const mock = new MockAdapter(axios);

describe('constructNotionHeaders', () => {
	it(`Should return token attached header`, () => {
		expect(
			constructNotionHeaders({
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
			constructNotionHeaders({
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
			constructNotionHeaders({
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
		expect(constructNotionHeaders({})).toStrictEqual({
			headers: {}
		});
	});

	it(`Should return empty header when nothing is passed`, () => {
		expect(constructNotionHeaders()).toStrictEqual({
			headers: {}
		});
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
			token: 'token',
			interval: 0
		});

		expect(JSON.parse(response.config.data)).toStrictEqual(request_data);
		expect(response.request.responseURL).toBe(`https://www.notion.so/api/v3/syncRecordValues`);
		expect(response.data).toStrictEqual(response_data);
	});
});

describe('sendRequest', () => {
	it(`Should work without any config passed`, async () => {
		const request_data = {
				req: 'request_data'
			},
			response_data = {
				res: 'response_data'
			};
		mock.onPost('/syncRecordValues').replyOnce(200, response_data);
		const response = await sendRequest<SyncRecordValuesResult>('syncRecordValues', request_data);
		expect(response).toStrictEqual(response_data);
	});

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
		expect(response).toStrictEqual(response_data);
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
			interval: 0
		});
		expect(response).toStrictEqual(response_data);
	});

	it(`Should respond to request error`, async () => {
		const request_data = {
			req: 'request_data'
		};
		mock.onPost('/syncRecordValues').networkErrorOnce();
		try {
			await sendRequest<SyncRecordValuesResult>('syncRecordValues', request_data, {
				token: 'token',
				interval: 0
			});
		} catch (err) {
			expect(err).toBeTruthy();
		}
	});
});
