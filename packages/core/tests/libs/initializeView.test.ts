import { initializeViewAggregations, initializeViewFilters, initializeViewSorts } from '../../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('initializeViewAggregations', () => {
	it(`Should create query2 and return aggregations`, () => {
		const view: any = {};
		const aggregations = initializeViewAggregations(view);
		expect(aggregations).toStrictEqual([]);
		expect(view).toStrictEqual({
			query2: {
				aggregations: []
			}
		});
	});

	it(`Should create and return aggregations`, () => {
		const view: any = { query2: { sort: [] } };
		const aggregations = initializeViewAggregations(view);
		expect(aggregations).toStrictEqual([]);
		expect(view).toStrictEqual({
			query2: {
				sort: [],
				aggregations: []
			}
		});
	});
});

describe('initializeViewSorts', () => {
	it(`Should create query2 and return sort`, () => {
		const view: any = {};
		const sort = initializeViewSorts(view);
		expect(sort).toStrictEqual([]);
		expect(view).toStrictEqual({
			query2: {
				sort: []
			}
		});
	});

	it(`Should create and return sort`, () => {
		const view: any = { query2: { aggregations: [] } };
		const sort = initializeViewSorts(view);
		expect(sort).toStrictEqual([]);
		expect(view).toStrictEqual({
			query2: {
				sort: [],
				aggregations: []
			}
		});
	});
});

describe('initializeViewFilters', () => {
	it(`Should create query2 and return filters`, () => {
		const view: any = {};
		const filters = initializeViewFilters(view);
		expect(filters).toStrictEqual({
			operator: 'and',
			filters: []
		});
		expect(view).toStrictEqual({
			query2: {
				filter: {
					operator: 'and',
					filters: []
				}
			}
		});
	});

	it(`Should create and return filters`, () => {
		const view: any = { query2: { aggregations: [] } };
		const filters = initializeViewFilters(view);
		expect(filters).toStrictEqual({
			operator: 'and',
			filters: []
		});
		expect(view).toStrictEqual({
			query2: {
				filter: {
					operator: 'and',
					filters: []
				},
				aggregations: []
			}
		});
	});
});
