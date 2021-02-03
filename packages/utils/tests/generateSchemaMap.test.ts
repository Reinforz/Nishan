import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import deepEqual from 'deep-equal';

import { getCollectionBlock, getCollection, constructHeaders } from '../src/generateSchemaMap';
import { idToUuid } from '../src';

axios.defaults.baseURL = 'https://www.notion.so/api/v3';

const mock = new MockAdapter(axios);

const get_collection_block_response = {
	block: {
		'4b4bb21d-f68b-4113-b342-830687a5337a': {
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
		}
	}
};

const get_collection_response = {
	collection: {
		'a1c6ed91-3f8d-4d96-9fca-3e1a82657e7b': {
			role: 'editor',
			value: {
				id: 'a1c6ed91-3f8d-4d96-9fca-3e1a82657e7b',
				version: 89,
				cover: '',
				name: [ [ 'Collection View Page' ] ],
				schema: {
					';pxx': {
						name: 'Date',
						type: 'date'
					},
					title: {
						name: 'Name',
						type: 'title'
					}
				},
				parent_id: '4b4bb21d-f68b-4113-b342-830687a5337a',
				parent_table: 'block',
				alive: true,
				migrated: true
			}
		}
	}
};

describe('constructHeaders', () => {
	it('Should throw an error if token is empty or not provided', () => {
		expect(() => getCollectionBlock('', '')).toThrow('Empty token provided');
		expect(() => getCollectionBlock(undefined as any, '')).toThrow('Empty token provided');
	});

	it(`Should return correct headers`, () => {
		expect(
			deepEqual(constructHeaders('token'), {
				headers: {
					cookie: `token_v2=token;`
				}
			})
		).toBe(true);
	});
});

describe('getCollectionBlock', () => {
	it(`Should return correct collection block`, async () => {
		const id = '4b4bb21df68b4113b342830687a5337a',
			uuid = idToUuid(id);

		mock.onPost('/syncRecordValues').reply(200, get_collection_block_response);

		const response = await getCollectionBlock('token', id);

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
		expect(deepEqual(response.data, get_collection_block_response)).toBe(true);
	});

	it('Should throw an error if id is empty or not provided', () => {
		expect(() => getCollectionBlock('token', '')).toThrow('Empty id provided');
		expect(() => getCollectionBlock('token', undefined as any)).toThrow('Empty id provided');
	});
});

describe('getCollection', () => {
	it(`Should return correct collection`, async () => {
		const id = 'a1c6ed913f8d4d969fca3e1a82657e7b',
			uuid = idToUuid(id);

		mock.onPost('/syncRecordValues').reply(200, get_collection_response);

		const response = await getCollection('token', id);

		expect(
			deepEqual(JSON.parse(response.config.data), {
				requests: [
					{
						table: 'collection',
						id: uuid,
						version: 0
					}
				]
			})
		).toBe(true);

		expect(response.request.responseURL).toBe(`https://www.notion.so/api/v3/syncRecordValues`);
		expect(deepEqual(response.data, get_collection_response)).toBe(true);
	});

	it('Should throw an error if id is empty or not provided', () => {
		expect(() => getCollection('token', '')).toThrow('Empty id provided');
		expect(() => getCollection('token', undefined as any)).toThrow('Empty id provided');
	});
});
