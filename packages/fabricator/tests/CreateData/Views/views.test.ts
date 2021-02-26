import { NotionCacheObject } from '@nishans/cache';
import { IOperation, Schema } from '@nishans/types';
import { v4 } from 'uuid';
import { o } from '../../../../core/tests/utils';
import { CreateData } from '../../../src';
import { tsu } from '../../utils';

afterEach(() => {
	jest.restoreAllMocks();
});

const default_nishan_arg = {
	token: 'token',
	user_id: 'user_id',
	space_id: 'space_id',
	shard_id: 123
};

const default_collection = {
	id: 'collection_id',
	schema: {
		title: tsu
	} as Schema,
	parent_id: 'parent_id'
};

describe('Output correctly', () => {
	it(`Should work correctly`, () => {
		// for covering other areas
		CreateData.views(
			default_collection,
			[
				{
					type: 'table',
					name: 'Table',
					schema_units: [ tsu ]
				}
			],
			{
				stack: [],
				cache: NotionCacheObject.createDefaultCache(),
				...default_nishan_arg
			},
			'parent_id'
		);

		const id = v4(),
			stack: IOperation[] = [],
			cache = NotionCacheObject.createDefaultCache(),
			filter: any = {
				operator: 'string_is',
				value: {
					type: 'exact',
					value: '123'
				}
			},
			logger = jest.fn();

		const expected_view_data = {
			id,
			version: 0,
			type: 'table',
			name: 'Table',
			page_sort: [],
			parent_id: 'parent_id',
			parent_table: 'block',
			alive: true,
			format: {
				table_properties: [
					{
						property: 'title',
						visible: true,
						width: 250
					}
				],
				table_wrap: false
			},
			query2: {
				aggregations: [],
				sort: [],
				filter: {
					operator: 'and',
					filters: [
						{
							property: 'title',
							filter
						}
					]
				}
			},
			shard_id: 123,
			space_id: 'space_id'
		};

		CreateData.views(
			default_collection,
			[
				{
					id,
					type: 'table',
					name: 'Table',
					schema_units: [ tsu ],
					filters: [
						{
							...tsu,
							filter
						}
					]
				}
			],
			{
				stack,
				cache,
				...default_nishan_arg,
				logger
			},
			'parent_id'
		);

		// expect(view_ids).toStrictEqual([ id ]);
		// expect on returned view data
		expect(stack).toStrictEqual([ o.cv.u(id, [], expected_view_data) ]);
		expect(logger).toHaveBeenCalledWith('CREATE', 'collection_view', id);
	});
});

describe('throws error', () => {
	it(`empty input values`, () => {
		expect(() =>
			CreateData.views(
				default_collection,
				[],
				{
					...default_nishan_arg,
					stack: [],
					cache: NotionCacheObject.createDefaultCache(),
					logger: () => {
						return;
					}
				},
				'parent_id'
			)
		).toThrow(`input views array cannot be empty`);
	});
});
