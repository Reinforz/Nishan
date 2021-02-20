import { ViewSorts } from '@nishans/types';
import { populateQuery2SortAndAggregations } from '../../../../../libs/CreateData/Views/utils';

describe('populateQuery2SortAndAggregations', () => {
	it(`Sort undefined, aggregation text`, () => {
		const query2 = {
			aggregations: [],
			sort: []
		};

		populateQuery2SortAndAggregations(
			{
				aggregation: 'count'
			},
			{
				schema_id: 'text'
			},
			query2
		);

		expect(query2).toStrictEqual({
			sort: [],
			aggregations: [
				{
					property: 'text',
					aggregator: 'count'
				}
			]
		});
	});

	it(`Sort text, aggregation text`, () => {
		const query2 = {
			aggregations: [],
			sort: []
		};

		populateQuery2SortAndAggregations(
			{
				sort: 'ascending',
				aggregation: 'count'
			},
			{
				schema_id: 'text'
			},
			query2
		);

		expect(query2).toStrictEqual({
			sort: [
				{
					property: 'text',
					direction: 'ascending'
				}
			],
			aggregations: [
				{
					property: 'text',
					aggregator: 'count'
				}
			]
		});
	});

	it(`Sort [TSort, number], Aggregation: undefined`, () => {
		const query2 = {
			aggregations: [],
			sort: [
				{
					property: 'number',
					direction: 'descending'
				}
			] as ViewSorts[]
		};

		populateQuery2SortAndAggregations(
			{
				sort: [ 'ascending', 0 ]
			},
			{
				schema_id: 'text'
			},
			query2
		);

		expect(query2).toStrictEqual({
			sort: [
				{
					property: 'text',
					direction: 'ascending'
				},
				{
					property: 'number',
					direction: 'descending'
				}
			],
			aggregations: []
		});
	});
});
