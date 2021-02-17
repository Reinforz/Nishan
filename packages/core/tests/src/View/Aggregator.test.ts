import { IOperation } from '@nishans/types';
import { ViewAggregator } from '../../../src';
import { detectAggregationErrors } from '../../../src/View/Aggregator';
import { createDefaultCache } from '../../createDefaultCache';

describe('detectAggregationErrors', () => {
	it(`unknown property reference error`, () => {
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
					]
				]),
				{ type: 'title', name: 'Unknown' },
				new Map() as any
			)
		).toThrow(`Unknown property Unknown referenced in name`);
	});

	it(`Type mismatch error`, () => {
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
							type: 'title',
							name: 'Text'
						}
					]
				]),
				{ type: 'text', name: 'Text' },
				new Map() as any
			)
		).toThrow(`Type mismatch, text not equal to title`);
	});

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
		).toThrow(`An aggregation for Text already exists.`);
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
			...createDefaultCache(),
			block: new Map([ [ 'block_1', { collection_id: 'collection_1', id: 'block_1' } ] ]),
			collection: new Map([ [ 'collection_1', collection_1 as any ] ]),
			collection_view: new Map([ [ 'collection_view_1', collection_view_1 ] ])
		} as any,
		stack: IOperation[] = [];

	const view_aggregator = new ViewAggregator({
		cache,
		id: 'collection_view_1',
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		stack,
		token: 'token',
		user_id: 'user_root_1'
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

	expect(stack).toStrictEqual([
		expect.objectContaining({
			command: 'update',
			table: 'collection_view',
			id: 'collection_view_1',
			path: [ 'query2', 'aggregations' ],
			args: {
				aggregations
			}
		})
	]);
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
			...createDefaultCache(),
			block: new Map([ [ 'block_1', { collection_id: 'collection_1', id: 'block_1' } ] ]),
			collection: new Map([ [ 'collection_1', collection_1 as any ] ]),
			collection_view: new Map([ [ 'collection_view_1', collection_view_1 ] ])
		} as any,
		stack: IOperation[] = [];

	const view_aggregator = new ViewAggregator({
		cache,
		id: 'collection_view_1',
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		stack,
		token: 'token',
		user_id: 'user_root_1'
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

	expect(stack[1]).toStrictEqual(
		expect.objectContaining({
			command: 'update',
			table: 'collection_view',
			id: 'collection_view_1',
			path: [ 'query2', 'aggregations' ],
			args: {
				aggregations
			}
		})
	);
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
			...createDefaultCache(),
			block: new Map([ [ 'block_1', { collection_id: 'collection_1', id: 'block_1' } ] ]),
			collection: new Map([ [ 'collection_1', collection_1 as any ] ]),
			collection_view: new Map([ [ 'collection_view_1', collection_view_1 ] ])
		} as any,
		stack: IOperation[] = [];

	const view_aggregator = new ViewAggregator({
		cache,
		id: 'collection_view_1',
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		stack,
		token: 'token',
		user_id: 'user_root_1'
	});

	await view_aggregator.deleteAggregation('Title');

	const aggregations: any[] = [];

	expect(collection_view_1.query2.aggregations).toStrictEqual(aggregations);

	expect(stack[1]).toStrictEqual(
		expect.objectContaining({
			command: 'update',
			table: 'collection_view',
			id: 'collection_view_1',
			path: [ 'query2', 'aggregations' ],
			args: {
				aggregations
			}
		})
	);
});
