import { NotionInit } from '../../libs';

it(`Should create query2 and return sort`, () => {
	const view: any = {};
	const sort = NotionInit.View.sort(view);
	expect(sort).toStrictEqual([]);
	expect(view).toStrictEqual({
		query2: {
			sort: []
		}
	});
});

it(`Should create and return sort`, () => {
	const view: any = { query2: { aggregations: [] } };
	const sort = NotionInit.View.sort(view);
	expect(sort).toStrictEqual([]);
	expect(view).toStrictEqual({
		query2: {
			sort: [],
			aggregations: []
		}
	});
});
