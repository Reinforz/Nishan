import { NotionRequest } from '../../libs';
import { notion_request_configs } from './utils';

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
		expect(NotionRequest.constructHeaders(notion_request_configs)).toStrictEqual({
			headers: {
				cookie: 'token_v2=token;notion_user_id=user_id;',
				['x-notion-active-user-header']: 'user_id'
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
