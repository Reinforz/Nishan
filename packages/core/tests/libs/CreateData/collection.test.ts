import { ICache, NotionCacheObject } from '@nishans/cache';
import { IOperation } from '@nishans/types';
import { CreateData } from '../../../libs/CreateData';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('createCollection', () => {
	it(`createCollection should work correctly`, async () => {
		const cache: ICache = NotionCacheObject.createDefaultCache();
		const stack: IOperation[] = [];
		const [ collection_id ] = await CreateData.collection(
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
				interval: 0,
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
		expect(stack[1]).toStrictEqual({
			table: 'collection',
			command: 'update',
			id: collection_id,
			args: output_collection,
			path: []
		});
		expect(cache.collection.get(collection_id)).toStrictEqual(output_collection);
	});
});
