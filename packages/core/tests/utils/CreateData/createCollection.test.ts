import { ICache } from '@nishans/cache';
import { IOperation } from '@nishans/types';
import deepEqual from 'deep-equal';
import axios from 'axios';

import { createCollection } from '../../../utils/CreateData/createCollection';

axios.defaults.baseURL = 'https://www.notion.so/api/v3';

const default_cache: ICache = {
	block: new Map(),
	collection: new Map(),
	space: new Map(),
	collection_view: new Map(),
	notion_user: new Map(),
	space_view: new Map(),
	user_root: new Map(),
	user_settings: new Map()
};

describe('createCollection', () => {
	it(`createCollection should work correctly`, async () => {
		const cache: ICache = default_cache;
		const stack: IOperation[] = [];
		const [ collection_id ] = await createCollection(
			{
				name: [ [ 'Collection Name' ] ],
				schema: [
					{
						type: 'title',
						name: 'Title'
					}
				],
				views: [
					{
						type: 'table',
						name: 'Table View',
						schema_units: [
							{
								type: 'title',
								name: 'Title'
							}
						]
					}
				]
			},
			'parent_id',
			{
				cache,
				stack,
				logger () {
					return;
				},
				shard_id: 123,
				space_id: 'space_id',
				token: 'token',
				user_id: 'user_id'
			}
		);
		const output_collection = {
			id: collection_id,
			schema: {
				title: {
					type: 'title',
					name: 'Title'
				}
			},
			parent_id: 'parent_id',
			parent_table: 'block',
			alive: true,
			name: [ [ 'Collection Name' ] ],
			migrated: false,
			version: 0
		};

		expect(typeof collection_id).toBe('string');
		expect(stack.length).toBe(2);
		expect(
			deepEqual(stack[1], {
				table: 'collection',
				command: 'update',
				id: collection_id,
				args: output_collection,
				path: []
			})
		).toBe(true);
		expect(deepEqual(cache.collection.get(collection_id), output_collection)).toBe(true);
	});
});
