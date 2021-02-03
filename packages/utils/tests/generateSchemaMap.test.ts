import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import deepEqual from 'deep-equal';

import { getCollectionBlock, generateSchemaMap } from '../src/generateSchemaMap';
import { idToUuid } from '../src';

axios.defaults.baseURL = 'https://www.notion.so/api/v3';

const mock = new MockAdapter(axios);

const cvp_data = {
	role: 'editor',
	value: {
		id: '4b4bb21d-f68b-4113-b342-830687a5337a',
		version: 23,
		type: 'collection_view_page',
		view_ids: [ '451a024a-f6f8-476d-9a5a-1c98ffdf5a38' ],
		collection_id: 'a1c6ed91-3f8d-4d96-9fca-3e1a82657e7b',
		permissions: [
			{
				role: 'editor',
				type: 'user_permission',
				user_id: 'd94caf87-a207-45c3-b3d5-03d157b5b39b'
			}
		],
		created_time: 1602390407523,
		last_edited_time: 1609505580000,
		parent_id: 'd2498a62-99ed-4ffd-b56d-e986001729f4',
		parent_table: 'space',
		alive: true,
		created_by_table: 'notion_user',
		created_by_id: 'd94caf87-a207-45c3-b3d5-03d157b5b39b',
		last_edited_by_table: 'notion_user',
		last_edited_by_id: 'd94caf87-a207-45c3-b3d5-03d157b5b39b',
		shard_id: 227383,
		space_id: 'd2498a62-99ed-4ffd-b56d-e986001729f4'
	}
};

describe('getCollectionBlock', () => {
	it(`Should return correct schema_map`, async () => {
		const id = 'cd2eba4d6fd5435e8e7ea60471ea5912',
			uuid = idToUuid(id);

		mock.onPost('/syncRecordValues').reply(200, cvp_data);

		const response = await getCollectionBlock('token', id);

		expect(response.config.headers.cookie).toEqual(`token_v2=token;`);
		expect(
			deepEqual(JSON.parse(response.config.data), {
				requests: [
					{
						table: 'block',
						id: uuid,
						version: 0
					}
				]
			})
		).toBe(true);

		expect(response.request.responseURL).toBe(`https://www.notion.so/api/v3/syncRecordValues`);
		expect(deepEqual(response.data, cvp_data)).toBe(true);
	});

	it('Should throw an error if token is empty or not provided', () => {
		expect(() => getCollectionBlock('', '')).toThrow('Empty token provided');
		expect(() => getCollectionBlock(undefined as any, '')).toThrow('Empty token provided');
	});

	it('Should throw an error if id is empty or not provided', () => {
		expect(() => getCollectionBlock('token', '')).toThrow('Empty id provided');
		expect(() => getCollectionBlock('token', undefined as any)).toThrow('Empty id provided');
	});
});
