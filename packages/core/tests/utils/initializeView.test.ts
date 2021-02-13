import deepEqual from 'deep-equal';
import { initializeViewAggregations, initializeViewFilters, initializeViewSorts } from '../../src';

describe('initializeViewAggregations', () => {
	it(`Should create query2 and return aggregations`, () => {
		const view: any = {};
		const aggregations = initializeViewAggregations(view);
		expect(deepEqual(aggregations, [])).toBe(true);
		expect(
			deepEqual(view, {
				query2: {
					aggregations: []
				}
			})
		).toBe(true);
	});

	it(`Should create and return aggregations`, () => {
		const view: any = { query2: { sort: [] } };
		const aggregations = initializeViewAggregations(view);
		expect(deepEqual(aggregations, [])).toBe(true);
		expect(
			deepEqual(view, {
				query2: {
					sort: [],
					aggregations: []
				}
			})
		).toBe(true);
	});
});

describe('initializeViewSorts', () => {
	it(`Should create query2 and return sort`, () => {
		const view: any = {};
		const sort = initializeViewSorts(view);
		expect(deepEqual(sort, [])).toBe(true);
		expect(
			deepEqual(view, {
				query2: {
					sort: []
				}
			})
		).toBe(true);
	});

	it(`Should create and return sort`, () => {
		const view: any = { query2: { aggregations: [] } };
		const sort = initializeViewSorts(view);
		expect(deepEqual(sort, [])).toBe(true);
		expect(
			deepEqual(view, {
				query2: {
					sort: [],
					aggregations: []
				}
			})
		).toBe(true);
	});
});

describe('initializeViewFilters', () => {
	it(`Should create query2 and return filters`, () => {
		const view: any = {};
		const filters = initializeViewFilters(view);
		expect(
			deepEqual(filters, {
				operator: 'and',
				filters: []
			})
		).toBe(true);
		expect(
			deepEqual(view, {
				query2: {
					filter: {
						operator: 'and',
						filters: []
					}
				}
			})
		).toBe(true);
	});

	it(`Should create and return filters`, () => {
		const view: any = { query2: { aggregations: [] } };
		const filters = initializeViewFilters(view);
		expect(
			deepEqual(filters, {
				operator: 'and',
				filters: []
			})
		).toBe(true);
		expect(
			deepEqual(view, {
				query2: {
					filter: {
						operator: 'and',
						filters: []
					},
					aggregations: []
				}
			})
		).toBe(true);
	});
});
