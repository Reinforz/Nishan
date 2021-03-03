import { NotionCacheObject } from '@nishans/cache';
import { NotionOperationsObject } from '@nishans/operations';
import { tsu, txsu } from '../../../../fabricator/tests/utils';
import { NotionData, View } from '../../../libs';
import { default_nishan_arg, o } from '../../utils';
import { tas, txas } from './utils';

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
				]
			}
		} as any,
		block_1 = { collection_id: 'collection_1', id: 'block_1' },
		cache = {
			...NotionCacheObject.createDefaultCache(),
			block: new Map([ [ 'block_1', block_1 ] ]),
			collection: new Map([ [ 'collection_1', collection_1 as any ] ]),
			collection_view: new Map([ [ 'collection_view_1', collection_view_1 ] ])
		} as any,
		executeOperationsMock = jest
			.spyOn(NotionOperationsObject, 'executeOperations')
			.mockImplementation(async () => undefined);

	const view = new View({
		...default_nishan_arg,
		cache,
		id: 'collection_view_1'
	});
	return { view, cache, block_1, collection_view_1, collection_1, executeOperationsMock };
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
	const { view, block_1 } = construct();
	const addToChildArrayMock = jest
		.spyOn(NotionData.prototype, 'addToChildArray' as any)
		.mockImplementationOnce(() => undefined);

	await view.reposition(0);
	expect(addToChildArrayMock).toHaveBeenCalledWith('block', block_1, 0);
});

it('update', async () => {
	const { view, collection_view_1, executeOperationsMock } = construct();

	await view.update({
		alive: false
	});

	expect(collection_view_1).toStrictEqual(
		expect.objectContaining({
			alive: false
		})
	);

	expect(executeOperationsMock.mock.calls[0][0]).toStrictEqual([
		o.cv.u('collection_view_1', [], {
			alive: false
		})
	]);
});

describe('createSorts', () => {
	it(`pos=undefined`, async () => {
		const { view, collection_view_1, executeOperationsMock } = construct();

		await view.createSorts([ [ 'Text', 'ascending' ] ]);

		expect(collection_view_1.query2.sort[1]).toStrictEqual(txas);
		expect(executeOperationsMock.mock.calls[0][0]).toStrictEqual([
			o.cv.s('collection_view_1', [ 'query2', 'sort' ], expect.arrayContaining([ txas ]))
		]);
	});

	it(`pos=number`, async () => {
		const { view, collection_view_1, executeOperationsMock } = construct();

		await view.createSorts([ [ 'Text', 'ascending', 0 ] ]);

		expect(collection_view_1.query2.sort).toStrictEqual([ txas, tas ]);
		expect(executeOperationsMock.mock.calls[0][0]).toStrictEqual([
			o.cv.s('collection_view_1', [ 'query2', 'sort' ], [ txas, tas ])
		]);
	});

	it(`throws error when property already has a sort `, async () => {
		const { view } = construct();
		await expect(() => view.createSorts([ [ 'Title', 'ascending', 0 ] ])).rejects.toThrow();
	});
});

describe('updateSort', () => {
	it(`pos=undefined`, async () => {
		const { view, collection_view_1, executeOperationsMock } = construct();
		const sort = [
			{
				direction: 'descending',
				property: 'title'
			}
		];

		await view.updateSort([ 'Title', 'descending' ]);

		expect(collection_view_1.query2.sort).toStrictEqual(sort);
		expect(executeOperationsMock.mock.calls[1][0]).toStrictEqual([
			o.cv.s('collection_view_1', [ 'query2', 'sort' ], sort)
		]);
	});

	it(`pos=number`, async () => {
		const { view, collection_view_1, executeOperationsMock } = construct();
		collection_view_1.query2.sort = [ txas, tas ];
		const sort = [ tas, txas ];

		await view.updateSort([ 'Text', 1 ]);

		expect(collection_view_1.query2.sort).toStrictEqual(sort);
		expect(executeOperationsMock.mock.calls[1][0]).toStrictEqual([
			o.cv.s('collection_view_1', [ 'query2', 'sort' ], sort)
		]);
	});

	it(`pos=[direction,number]`, async () => {
		const { view, collection_view_1, executeOperationsMock } = construct();
		collection_view_1.query2.sort = [ { ...txas }, { ...tas } ];
		const sort = [ { ...tas, direction: 'descending' }, txas ];

		await view.updateSort([ 'Title', [ 'descending', 0 ] ]);

		expect(collection_view_1.query2.sort).toStrictEqual(sort);
		expect(executeOperationsMock.mock.calls[1][0]).toStrictEqual([
			o.cv.s('collection_view_1', [ 'query2', 'sort' ], sort)
		]);
	});
});

it(`deleteSort`, async () => {
	const { view, collection_view_1, executeOperationsMock } = construct();

	await view.deleteSort('Title');

	expect(collection_view_1.query2.sort).toStrictEqual([]);
	expect(executeOperationsMock.mock.calls[1][0]).toStrictEqual([
		o.cv.s('collection_view_1', [ 'query2', 'sort' ], [])
	]);
});

describe('updateFormatProperty', () => {
	it(`format, width and position all given`, async () => {
		const { view, collection_view_1, executeOperationsMock } = construct();

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
		expect(executeOperationsMock.mock.calls[1][0]).toStrictEqual([
			o.cv.s('collection_view_1', [ 'format', 'table_properties' ], table_properties)
		]);
	});

	it(`format, width and position none given`, async () => {
		const { view, collection_view_1, executeOperationsMock } = construct();
		const table_properties = [
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
		];

		await view.updateFormatProperty([ 'Title', { type: 'table' } ]);

		expect(collection_view_1.format.table_properties).toStrictEqual(table_properties);
		expect(executeOperationsMock.mock.calls[1][0]).toStrictEqual([
			o.cv.s('collection_view_1', [ 'format', 'table_properties' ], table_properties)
		]);
	});
});

it(`createFilters`, async () => {
	const { view, collection_view_1, executeOperationsMock } = construct();

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
	expect(executeOperationsMock.mock.calls[0][0]).toStrictEqual([
		o.cv.u('collection_view_1', [ 'query2', 'filter' ], collection_view_1.query2.filter)
	]);
});

describe('updateFilters', () => {
	it(`separate property and same position`, async () => {
		const { view, collection_view_1, executeOperationsMock } = construct();

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
		expect(executeOperationsMock.mock.calls[1][0]).toStrictEqual([
			o.cv.u('collection_view_1', [ 'query2', 'filter' ], collection_view_1.query2.filter)
		]);
	});

	it(`same property and different position`, async () => {
		const { view, collection_view_1, executeOperationsMock } = construct();

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
		expect(executeOperationsMock.mock.calls[1][0]).toStrictEqual([
			o.cv.u('collection_view_1', [ 'query2', 'filter' ], collection_view_1.query2.filter)
		]);
	});
});

it(`deleteFilter`, async () => {
	const { view, collection_view_1, executeOperationsMock } = construct();
	await view.deleteFilter('0');

	expect(collection_view_1.query2.filter.filters.length).toBe(1);
	expect(executeOperationsMock.mock.calls[1][0]).toStrictEqual([
		o.cv.u('collection_view_1', [ 'query2', 'filter' ], collection_view_1.query2.filter)
	]);
});
