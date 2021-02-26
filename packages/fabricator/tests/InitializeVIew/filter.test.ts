import { InitializeView } from '../../';

it(`Should create query2 and return filters`, () => {
	const view: any = {};
	const filters = InitializeView.filter(view);
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
	const filters = InitializeView.filter(view);
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
