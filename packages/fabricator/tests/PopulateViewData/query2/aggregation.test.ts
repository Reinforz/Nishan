import { PopulateViewData } from '../../../libs';

it(`Sort undefined, aggregation text`, () => {
	const query2 = {
		aggregations: [],
		sort: []
	};

	PopulateViewData.query2.aggregation('count', 'text', query2.aggregations);

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

it(`aggregation text`, () => {
	const query2 = {
		aggregations: [],
		sort: []
	};

	PopulateViewData.query2.aggregation('count', 'text', query2.aggregations);

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
