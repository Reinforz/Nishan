import { NotionCache } from '@nishans/cache';
import { NotionUtils } from '@nishans/utils';
import { createExecuteOperationsMock } from '../../../../../utils/tests';
import { tsu, txsu } from '../../../../fabricator/tests/utils';
import { NotionCore } from '../../../libs';
import { detectAggregationErrors } from '../../../libs/Api/View/Aggregator';
import { default_nishan_arg, o } from '../../utils';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('detectAggregationErrors', () => {
	it(`Aggregation already exists`, () => {
		expect(() =>
			detectAggregationErrors(
				NotionUtils.generateSchemaMap({
					title: tsu,
					text: txsu
				}),
				{ type: 'text', name: 'Text' },
				new Map([ [ 'Text', {} as any ] ]) as any
			)
		).toThrow();
	});

	it(`Works correctly`, () => {
		detectAggregationErrors(
			NotionUtils.generateSchemaMap({
				title: tsu,
				text: txsu
			}),
			{ type: 'text', name: 'Text' },
			new Map()
		);
	});
});

const aggregationCrudSetup = () => {
	const collection_1 = {
			schema: {
				title: tsu,
				text: txsu
			}
		} as any,
		collection_view_1 = {
			parent_id: 'block_1',
			id: 'collection_view_1',
			query2: {
				aggregations: [
					{
						property: 'text',
						aggregator: 'count'
					}
				]
			}
		} as any,
		cache = {
			...NotionCache.createDefaultCache(),
			block: new Map([ [ 'block_1', { collection_id: 'collection_1', id: 'block_1' } ] ]),
			collection: new Map([ [ 'collection_1', collection_1 as any ] ]),
			collection_view: new Map([ [ 'collection_view_1', collection_view_1 ] ])
		} as any,
		initializeCacheForSpecificDataMock = jest
			.spyOn(NotionCache, 'initializeCacheForSpecificData')
			.mockImplementationOnce(async () => undefined),
		{ e1, e2, executeOperationsMock } = createExecuteOperationsMock();

	const view_aggregator = new NotionCore.Api.ViewAggregator({
		...default_nishan_arg,
		cache,
		id: 'collection_view_1'
	});
	return {
		view_aggregator,
		cache,
		collection_view_1,
		collection_1,
		initializeCacheForSpecificDataMock,
		executeOperationsMock,
		e1,
		e2
	};
};

it(`createAggregation`, async () => {
	const { view_aggregator, collection_view_1, initializeCacheForSpecificDataMock, e1 } = aggregationCrudSetup();

	await view_aggregator.createAggregation({
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

	expect(collection_view_1.query2.aggregations).toStrictEqual(expect.arrayContaining(aggregations));
	e1([ o.cv.s('collection_view_1', [ 'query2', 'aggregations' ], expect.arrayContaining(aggregations)) ]);
	expect(initializeCacheForSpecificDataMock).not.toHaveBeenCalled();
});

it(`updateAggregations`, async () => {
	const { view_aggregator, collection_view_1, initializeCacheForSpecificDataMock, e2 } = aggregationCrudSetup();

	await view_aggregator.updateAggregation([
		'Text',
		{
			type: 'text',
			aggregator: 'not_empty'
		}
	]);

	const aggregation = {
		property: 'text',
		aggregator: 'not_empty'
	};

	expect(collection_view_1.query2.aggregations[0]).toStrictEqual(aggregation);
	e2([ o.cv.s('collection_view_1', [ 'query2', 'aggregations' ], expect.arrayContaining([ aggregation ])) ]);
	expect(initializeCacheForSpecificDataMock).not.toHaveBeenCalled();
});

it(`deleteAggregation`, async () => {
	const { view_aggregator, collection_view_1, initializeCacheForSpecificDataMock, e2 } = aggregationCrudSetup();

	await view_aggregator.deleteAggregation('Text');

	expect(initializeCacheForSpecificDataMock).not.toHaveBeenCalled();
	expect(collection_view_1.query2.aggregations).toStrictEqual([]);
	e2([ o.cv.s('collection_view_1', [ 'query2', 'aggregations' ], []) ]);
});
