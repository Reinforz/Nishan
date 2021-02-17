import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

import {
	getCollectionBlock,
	getCollection,
	constructHeaders,
	generateSchemaMapFromCollectionSchema
} from '../../src/generateSchemaMap';

import { generateSchemaMap, idToUuid } from '../../src';
import { RecordMap, Schema } from '@nishans/types';

axios.defaults.baseURL = 'https://www.notion.so/api/v3';

const mock = new MockAdapter(axios);

const get_collection_block_response: { recordMap: Partial<RecordMap> } = {
	recordMap: {
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
	}
};

const collection_schema: Schema = {
	';pxx': {
		name: 'Date',
		type: 'date'
	},
	title: {
		name: 'Name',
		type: 'title'
	}
};

const get_collection_response: { recordMap: Partial<RecordMap> } = {
	recordMap: {
		collection: {
			'a1c6ed91-3f8d-4d96-9fca-3e1a82657e7b': {
				role: 'editor',
				value: {
					id: 'a1c6ed91-3f8d-4d96-9fca-3e1a82657e7b',
					version: 89,
					cover: '',
					name: [ [ 'Collection View Page' ] ],
					schema: collection_schema,
					parent_id: '4b4bb21d-f68b-4113-b342-830687a5337a',
					parent_table: 'block',
					alive: true,
					migrated: true
				}
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
		expect(constructHeaders('token')).toStrictEqual({
			headers: {
				cookie: `token_v2=token;`
			}
		});
	});
});

describe('getCollectionBlock', () => {
	it(`Should return correct collection block`, async () => {
		const id = '4b4bb21df68b4113b342830687a5337a',
			uuid = idToUuid(id);

		mock.onPost('/syncRecordValues').replyOnce(200, get_collection_block_response);

		const response = await getCollectionBlock('token', id);

		expect(JSON.parse(response.config.data)).toStrictEqual({
			requests: [
				{
					table: 'block',
					id: uuid,
					version: 0
				}
			]
		});

		expect(response.request.responseURL).toBe(`https://www.notion.so/api/v3/syncRecordValues`);
		expect(response.data).toStrictEqual(get_collection_block_response);
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

		mock.onPost('/syncRecordValues').replyOnce(200, get_collection_response);

		const response = await getCollection('token', id);

		expect(JSON.parse(response.config.data)).toStrictEqual({
			requests: [
				{
					table: 'collection',
					id: uuid,
					version: 0
				}
			]
		});

		expect(response.request.responseURL).toBe(`https://www.notion.so/api/v3/syncRecordValues`);
		expect(response.data).toStrictEqual(get_collection_response);
	});

	it('Should throw an error if id is empty or not provided', () => {
		expect(() => getCollection('token', '')).toThrow('Empty id provided');
		expect(() => getCollection('token', undefined as any)).toThrow('Empty id provided');
	});
});

describe('collectionSchemaToSchemaMap', () => {
	it('Should create correct schema_map keys', () => {
		expect(Array.from(generateSchemaMapFromCollectionSchema(collection_schema).keys())).toStrictEqual([
			'Date',
			'Name'
		]);
	});

	it('Should create correct schema_map values', () => {
		expect(Array.from(generateSchemaMapFromCollectionSchema(collection_schema).values())).toStrictEqual([
			{
				name: 'Date',
				schema_id: ';pxx',
				type: 'date'
			},
			{
				name: 'Name',
				schema_id: 'title',
				type: 'title'
			}
		]);
	});
});

describe('generateSchemaMap', () => {
	it('generateSchemaMap should generate correct schema_map', async () => {
		mock
			.onPost('/syncRecordValues')
			.replyOnce(200, get_collection_block_response)
			.onPost('/syncRecordValues')
			.replyOnce(200, get_collection_response);

		const schema_map = await generateSchemaMap('token', '4b4bb21df68b4113b342830687a5337a');
		expect(Array.from(schema_map.values())).toStrictEqual([
			{
				name: 'Date',
				schema_id: ';pxx',
				type: 'date'
			},
			{
				name: 'Name',
				schema_id: 'title',
				type: 'title'
			}
		]);
	});
});
