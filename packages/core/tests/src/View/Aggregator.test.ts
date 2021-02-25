import { NotionCacheObject } from '@nishans/cache';
import { IOperation } from '@nishans/types';
import { ViewAggregator } from '../../../src';
import { detectAggregationErrors } from '../../../src/View/Aggregator';
import { default_nishan_arg, o } from '../../utils/';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('detectAggregationErrors', () => {
	it(`Aggregation already exists`, () => {
		expect(() =>
			detectAggregationErrors(
				new Map([
					[
						'Title',
						{
							schema_id: 'title',
							type: 'title',
							name: 'Title'
						}
					],
					[
						'Text',
						{
							schema_id: 'text',
							type: 'text',
							name: 'Text'
						}
					]
				]),
				{ type: 'text', name: 'Text' },
				new Map([ [ 'Text', {} as any ] ]) as any
			)
		).toThrow();
	});

	it(`Works correctly`, () => {
		detectAggregationErrors(
			new Map([
				[
					'Title',
					{
						schema_id: 'title',
						type: 'title',
						name: 'Title'
					}
				],
				[
					'Text',
					{
						schema_id: 'text',
						type: 'text',
						name: 'Text'
					}
				]
			]),
			{ type: 'text', name: 'Text' },
			new Map()
		);
	});
});

it(`createAggregation`, () => {
	const collection_1 = {
			schema: {
				title: {
					type: 'title',
					name: 'Title'
				}
			}
		} as any,
		collection_view_1 = { parent_id: 'block_1', id: 'collection_view_1' } as any,
		cache = {
			...NotionCacheObject.createDefaultCache(),
			block: new Map([ [ 'block_1', { collection_id: 'collection_1', id: 'block_1' } ] ]),
			collection: new Map([ [ 'collection_1', collection_1 as any ] ]),
			collection_view: new Map([ [ 'collection_view_1', collection_view_1 ] ])
		} as any,
		stack: IOperation[] = [];

	const view_aggregator = new ViewAggregator({
		...default_nishan_arg,
		cache,
		id: 'collection_view_1',
		stack
	});

	view_aggregator.createAggregation({
		type: 'title',
		aggregator: 'count',
		name: 'Title'
	});

	const aggregations = [
		{
			property: 'title',
			aggregator: 'count'
		}
	];

	expect(collection_view_1.query2.aggregations).toStrictEqual(aggregations);

	expect(stack).toStrictEqual([ o.cv.u('collection_view_1', [ 'query2', 'aggregations' ], { aggregations }) ]);
});

it(`updateAggregations`, async () => {
	const collection_1 = {
			schema: {
				title: {
					type: 'title',
					name: 'Title'
				}
			}
		} as any,
		collection_view_1 = {
			parent_id: 'block_1',
			id: 'collection_view_1',
			query2: {
				aggregations: [
					{
						property: 'title',
						aggregator: 'unknown'
					}
				]
			}
		} as any,
		cache = {
			...NotionCacheObject.createDefaultCache(),
			block: new Map([ [ 'block_1', { collection_id: 'collection_1', id: 'block_1' } ] ]),
			collection: new Map([ [ 'collection_1', collection_1 as any ] ]),
			collection_view: new Map([ [ 'collection_view_1', collection_view_1 ] ])
		} as any,
		stack: IOperation[] = [];

	const view_aggregator = new ViewAggregator({
		...default_nishan_arg,
		cache,
		id: 'collection_view_1',
		stack
	});

	await view_aggregator.updateAggregation([
		'Title',
		{
			type: 'title',
			aggregator: 'count'
		}
	]);

	const aggregations = [
		{
			property: 'title',
			aggregator: 'count'
		}
	];

	expect(collection_view_1.query2.aggregations).toStrictEqual(aggregations);

	expect(stack).toStrictEqual([ o.cv.u('collection_view_1', [ 'query2', 'aggregations' ], { aggregations }) ]);
});

it(`deleteAggregation`, async () => {
	const collection_1 = {
			schema: {
				title: {
					type: 'title',
					name: 'Title'
				}
			}
		} as any,
		collection_view_1 = {
			parent_id: 'block_1',
			id: 'collection_view_1',
			query2: {
				aggregations: [
					{
						property: 'title',
						aggregator: 'unknown'
					}
				]
			}
		} as any,
		cache = {
			...NotionCacheObject.createDefaultCache(),
			block: new Map([ [ 'block_1', { collection_id: 'collection_1', id: 'block_1' } ] ]),
			collection: new Map([ [ 'collection_1', collection_1 as any ] ]),
			collection_view: new Map([ [ 'collection_view_1', collection_view_1 ] ])
		} as any,
		stack: IOperation[] = [];

	const view_aggregator = new ViewAggregator({
		...default_nishan_arg,
		cache,
		id: 'collection_view_1',
		stack
	});

	await view_aggregator.deleteAggregation('Title');

	const aggregations: any[] = [];

	expect(collection_view_1.query2.aggregations).toStrictEqual(aggregations);
	expect(stack).toStrictEqual([ o.cv.u('collection_view_1', [ 'query2', 'aggregations' ], { aggregations }) ]);
});
