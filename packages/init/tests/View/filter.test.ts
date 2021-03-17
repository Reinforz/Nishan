import { NotionInit } from '../../libs';

it(`Should create query2 and return filters`, () => {
	const view: any = {};
	const filters = NotionInit.View.filter(view);
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
	const filters = NotionInit.View.filter(view);
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
