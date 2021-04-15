import { NotionCache } from '@nishans/cache';
import { tsu, txsu } from '@nishans/fabricator/tests/utils';
import { createExecuteOperationsMock } from '../../../../../utils/tests';
import { NotionCore } from '../../../libs';
import { default_nishan_arg, o } from '../../utils';

export const tas = {
	property: 'title',
	direction: 'ascending'
};

export const txas = {
	property: 'text',
	direction: 'ascending'
};

afterEach(() => {
	jest.restoreAllMocks();
});

const construct = () => {
	const collection_1 = {
			schema: {
				title: tsu,
				text: txsu
			}
		} as any,
		collection_view_1 = {
			type: 'table',
			parent_id: 'block_1',
			id: 'collection_view_1',
			query2: {
				sort: [ { ...tas } ],
				filter: {
					operator: 'and',
					filters: [
						{
							property: 'title',
							filter: {
								operator: 'string_contains',
								value: {
									type: 'exact',
									value: 'Something'
								}
							}
						},
						{
							property: 'text',
							filter: {
								operator: 'string_is',
								value: {
									type: 'exact',
									value: 'Something'
								}
							}
						}
					]
				}
			},
			format: {
				table_properties: [
					{
						width: 150,
						visible: true,
						property: 'title'
					},
					{
						width: 150,
						visible: true,
						property: 'text'
					}
				],
				list_properties: [
					{
						visible: true,
						property: 'title'
					},
					{
						visible: true,
						property: 'text'
					}
				]
			}
		} as any,
		collection_view_2 = {
			type: 'list',
			parent_id: 'block_1',
			id: 'collection_view_2',
			format: {
				list_properties: [
					{
						visible: true,
						property: 'title'
					},
					{
						visible: true,
						property: 'text'
					}
				]
			}
		} as any,
		block_1 = { collection_id: 'collection_1', id: 'block_1', type: 'collection_view_page' },
		cache = {
			...NotionCache.createDefaultCache(),
			block: new Map([ [ 'block_1', block_1 ] ]),
			collection: new Map([ [ 'collection_1', collection_1 as any ] ]),
			collection_view: new Map([
				[ 'collection_view_2', collection_view_2 ],
				[ 'collection_view_1', collection_view_1 ]
			])
		} as any,
		{ e1, e2, executeOperationsMock } = createExecuteOperationsMock();

	const view = new NotionCore.Api.View({
		...default_nishan_arg,
		cache,
		id: 'collection_view_1'
	});
	const view_2 = new NotionCore.Api.View({
		...default_nishan_arg,
		cache,
		id: 'collection_view_2'
	});
	return {
		e1,
		e2,
		executeOperationsMock,
		view,
		cache,
		block_1,
		view_2,
		collection_view_2,
		collection_view_1,
		collection_1
	};
};

it('getCollection', async () => {
	const { view, collection_1 } = construct();
	expect(await view.getCollection()).toStrictEqual(collection_1);
});

it('getCachedParentData', async () => {
	const { view, block_1 } = construct();
	expect(await view.getCachedParentData()).toStrictEqual(block_1);
});

it('reposition', async () => {
	const { e1, view, block_1 } = construct();

	await view.reposition();
	e1([
		o.b.la(
			block_1.id,
			[ 'view_ids' ],
			expect.objectContaining({
				id: 'collection_view_1'
			})
		)
	]);
});

describe('createSorts', () => {
	it(`pos=undefined`, async () => {
		const { view, collection_view_1, e1 } = construct();

		await view.createSorts([ [ 'Text', 'ascending' ] ]);

		expect(collection_view_1.query2.sort[1]).toStrictEqual(txas);
		e1([ o.cv.s('collection_view_1', [ 'query2', 'sort' ], expect.arrayContaining([ txas ])) ]);
	});

	it(`pos=number`, async () => {
		const { view, collection_view_1, e1 } = construct();

		await view.createSorts([ [ 'Text', 'ascending', 0 ] ]);

		expect(collection_view_1.query2.sort).toStrictEqual([ txas, tas ]);
		e1([ o.cv.s('collection_view_1', [ 'query2', 'sort' ], [ txas, tas ]) ]);
	});

	it(`throws error when property already has a sort `, async () => {
		const { view } = construct();
		await expect(() => view.createSorts([ [ 'Title', 'ascending', 0 ] ])).rejects.toThrow();
	});
});

describe('updateSort', () => {
	it(`pos=undefined`, async () => {
		const { view, collection_view_1, e2 } = construct();
		const sort = [
			{
				direction: 'descending',
				property: 'title'
			}
		];

		await view.updateSort([ 'Title', 'descending' ]);

		expect(collection_view_1.query2.sort).toStrictEqual(sort);
		e2([ o.cv.s('collection_view_1', [ 'query2', 'sort' ], sort) ]);
	});

	it(`pos=number`, async () => {
		const { view, collection_view_1, e2 } = construct();
		collection_view_1.query2.sort = [ txas, tas ];
		const sort = [ tas, txas ];

		await view.updateSort([ 'Text', 1 ]);

		expect(collection_view_1.query2.sort).toStrictEqual(sort);
		e2([ o.cv.s('collection_view_1', [ 'query2', 'sort' ], sort) ]);
	});

	it(`pos=[direction,number]`, async () => {
		const { view, collection_view_1, e2 } = construct();
		collection_view_1.query2.sort = [ { ...txas }, { ...tas } ];
		const sort = [ { ...tas, direction: 'descending' }, txas ];

		await view.updateSort([ 'Title', [ 'descending', 0 ] ]);

		expect(collection_view_1.query2.sort).toStrictEqual(sort);
		e2([ o.cv.s('collection_view_1', [ 'query2', 'sort' ], sort) ]);
	});
});

it(`deleteSort`, async () => {
	const { view, collection_view_1, e2 } = construct();

	await view.deleteSort('Title');

	expect(collection_view_1.query2.sort).toStrictEqual([]);
	e2([ o.cv.s('collection_view_1', [ 'query2', 'sort' ], []) ]);
});

describe('updateFormatProperty', () => {
	it(`format, width and position all given`, async () => {
		const { view, collection_view_1, e2 } = construct();

		const table_properties = [
			{
				width: 150,
				visible: true,
				property: 'text'
			},
			{
				width: 125,
				visible: false,
				property: 'title'
			}
		];
		await view.updateFormatProperty([ 'Title', { type: 'table', position: 1, visible: false, width: 125 } ]);

		expect(collection_view_1.format.table_properties).toStrictEqual(table_properties);
		e2([ o.cv.s('collection_view_1', [ 'format', 'table_properties' ], table_properties) ]);
	});

	it(`format, width and position none given`, async () => {
		const { view_2, collection_view_2, e2 } = construct();
		const list_properties = [
			{
				visible: true,
				property: 'title'
			},
			{
				visible: true,
				property: 'text'
			}
		];

		await view_2.updateFormatProperty([ 'Title', { type: 'list' } ]);

		expect(collection_view_2.format.list_properties).toStrictEqual(list_properties);
		e2([ o.cv.s('collection_view_2', [ 'format', 'list_properties' ], list_properties) ]);
	});
});

it(`createFilters`, async () => {
	const { view, collection_view_1, e1 } = construct();

	const filter_value: any = {
		operator: 'string_contains',
		value: {
			type: 'exact',
			value: 'Something'
		}
	};

	await view.createFilters([
		{
			name: 'Title',
			type: 'title',
			filter: filter_value
		}
	]);

	expect(collection_view_1.query2.filter.filters[2].filter).toStrictEqual(filter_value);
	e1([ o.cv.u('collection_view_1', [ 'query2', 'filter' ], collection_view_1.query2.filter) ]);
});

describe('updateFilters', () => {
	it(`separate property and same position`, async () => {
		const { view, collection_view_1, e2 } = construct();

		const filter_value = {
			operator: 'string_starts_with',
			value: {
				type: 'exact',
				value: 'Otherthing'
			}
		};

		await view.updateFilter([
			'0',
			{
				name: 'Text',
				type: 'text',
				filter: filter_value as any
			}
		]);

		expect(collection_view_1.query2.filter.filters[0].filter).toStrictEqual(filter_value);
		e2([ o.cv.u('collection_view_1', [ 'query2', 'filter' ], collection_view_1.query2.filter) ]);
	});

	it(`same property and different position`, async () => {
		const { view, collection_view_1, e2 } = construct();

		const filter_value = {
			operator: 'string_starts_with',
			value: {
				type: 'exact',
				value: 'Otherthing'
			}
		};

		await view.updateFilter([
			'0',
			{
				type: 'title',
				position: 1,
				filter: filter_value as any
			}
		]);

		expect(collection_view_1.query2.filter.filters[1].filter).toStrictEqual(filter_value);
		e2([ o.cv.u('collection_view_1', [ 'query2', 'filter' ], collection_view_1.query2.filter) ]);
	});
});

it(`deleteFilter`, async () => {
	const { view, collection_view_1, e2 } = construct();
	await view.deleteFilter('0');

	expect(collection_view_1.query2.filter.filters.length).toBe(1);
	e2([ o.cv.u('collection_view_1', [ 'query2', 'filter' ], collection_view_1.query2.filter) ]);
});
