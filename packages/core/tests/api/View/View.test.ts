import { ICache, NotionCacheObject } from '@nishans/cache';
import { IOperation } from '@nishans/types';
import { tsu } from '../../../../fabricator/tests/utils';
import { NotionData, View } from '../../../libs';
import { default_nishan_arg, last_edited_props, o } from '../../utils';
import { createCollection, tas, txas } from './utils';

afterEach(() => {
	jest.restoreAllMocks();
});

it('getCollection', () => {
	const collection_1 = {
			schema: {
				title: tsu
			}
		} as any,
		collection_view_1 = { parent_id: 'block_1', id: 'collection_view_1' } as any,
		cache = {
			...NotionCacheObject.createDefaultCache(),
			block: new Map([ [ 'block_1', { collection_id: 'collection_1', id: 'block_1' } ] ]),
			collection: new Map([ [ 'collection_1', collection_1 as any ] ]),
			collection_view: new Map([ [ 'collection_view_1', collection_view_1 ] ])
		} as any,
		stack: IOperation[] = [];

	const view = new View({
		...default_nishan_arg,
		cache,
		id: 'collection_view_1',
		stack
	});

	expect(view.getCollection()).toStrictEqual(collection_1);
});

it('getCachedParentData', () => {
	const collection_view_1 = { parent_id: 'block_1', id: 'collection_view_1' } as any,
		block_1: any = { collection_id: 'collection_1', id: 'block_1' },
		cache = {
			...NotionCacheObject.createDefaultCache(),
			block: new Map([ [ 'block_1', block_1 ] ]),
			collection_view: new Map([ [ 'collection_view_1', collection_view_1 ] ])
		} as any,
		stack: IOperation[] = [];

	const view = new View({
		...default_nishan_arg,
		cache,
		id: 'collection_view_1',
		stack
	});

	expect(view.getCachedParentData()).toStrictEqual(block_1);
});

it('reposition', () => {
	const collection_view_1 = { parent_id: 'block_1', id: 'collection_view_1' } as any,
		block_1: any = { collection_id: 'collection_1', id: 'block_1' },
		cache = {
			...NotionCacheObject.createDefaultCache(),
			block: new Map([ [ 'block_1', block_1 ] ]),
			collection_view: new Map([ [ 'collection_view_1', collection_view_1 ] ])
		} as any,
		stack: IOperation[] = [];

	const addToChildArrayMock = jest
		.spyOn(NotionData.prototype, 'addToChildArray' as any)
		.mockImplementationOnce(() => undefined);

	const view = new View({
		...default_nishan_arg,
		cache,
		id: 'collection_view_1',
		stack
	});

	view.reposition(0);
	expect(addToChildArrayMock).toHaveBeenCalledWith('block', block_1, 0);
});

it('update', () => {
	const collection_view_1 = { parent_id: 'block_1', id: 'collection_view_1' } as any,
		cache: ICache = {
			...NotionCacheObject.createDefaultCache(),
			collection_view: new Map([ [ 'collection_view_1', collection_view_1 ] ])
		},
		stack: IOperation[] = [];

	const view = new View({
		...default_nishan_arg,
		cache,
		id: 'collection_view_1',
		stack
	});

	view.update({
		alive: false
	});

	expect(cache.collection_view.get('collection_view_1')).toStrictEqual({
		parent_id: 'block_1',
		id: 'collection_view_1',
		alive: false,
		...last_edited_props
	});

	expect(stack).toStrictEqual([
		o.cv.u('collection_view_1', [], {
			alive: false,
			...last_edited_props
		})
	]);
});

describe('createSorts', () => {
	it(`pos=undefined`, () => {
		const collection_1: any = {
				id: 'collection_1',
				schema: {
					title: tsu
				}
			},
			collection_view_1 = {
				parent_id: 'block_1',
				id: 'collection_view_1',
				query2: {
					sort: []
				}
			} as any,
			cache: ICache = {
				...NotionCacheObject.createDefaultCache(),
				block: new Map([ [ 'block_1', { collection_id: 'collection_1', id: 'block_1' } as any ] ]),
				collection: new Map([ [ 'collection_1', collection_1 ] ]),
				collection_view: new Map([ [ 'collection_view_1', collection_view_1 ] ])
			},
			stack: IOperation[] = [];

		const view = new View({
			...default_nishan_arg,
			cache,
			id: 'collection_view_1',
			stack
		});
		const sort = [ tas ];

		view.createSorts([ [ 'Title', 'ascending' ] ]);

		expect(collection_view_1.query2.sort).toStrictEqual(sort);
		expect(stack).toStrictEqual([ o.cv.s('collection_view_1', [ 'query2', 'sort' ], sort) ]);
	});

	it(`pos=number`, () => {
		const collection_1 = createCollection(),
			collection_view_1 = {
				parent_id: 'block_1',
				id: 'collection_view_1',
				query2: {
					sort: [
						{
							direction: 'descending',
							property: 'title'
						}
					]
				}
			} as any,
			cache: ICache = {
				...NotionCacheObject.createDefaultCache(),
				block: new Map([ [ 'block_1', { collection_id: 'collection_1', id: 'block_1' } as any ] ]),
				collection: new Map([ [ 'collection_1', collection_1 ] ]),
				collection_view: new Map([ [ 'collection_view_1', collection_view_1 ] ])
			},
			stack: IOperation[] = [];

		const view = new View({
			...default_nishan_arg,
			cache,
			id: 'collection_view_1',
			stack
		});

		const sort = [
			txas,
			{
				direction: 'descending',
				property: 'title'
			}
		];

		view.createSorts([ [ 'Text', 'ascending', 0 ] ]);

		expect(collection_view_1.query2.sort).toStrictEqual(sort);
		expect(stack).toStrictEqual([ o.cv.s('collection_view_1', [ 'query2', 'sort' ], sort) ]);
	});

	it(`throws error when property already has a sort `, () => {
		const collection_1 = createCollection(),
			collection_view_1 = {
				parent_id: 'block_1',
				id: 'collection_view_1',
				query2: {
					sort: [
						{
							direction: 'descending',
							property: 'title'
						}
					]
				}
			} as any,
			cache: ICache = {
				...NotionCacheObject.createDefaultCache(),
				block: new Map([ [ 'block_1', { collection_id: 'collection_1', id: 'block_1' } as any ] ]),
				collection: new Map([ [ 'collection_1', collection_1 ] ]),
				collection_view: new Map([ [ 'collection_view_1', collection_view_1 ] ])
			};

		const view = new View({
			...default_nishan_arg,
			cache,
			id: 'collection_view_1'
		});

		expect(() => view.createSorts([ [ 'Title', 'ascending', 0 ] ])).toThrow();
	});
});

describe('updateSort', () => {
	it(`pos=undefined`, async () => {
		const collection_1 = createCollection(),
			collection_view_1 = {
				parent_id: 'block_1',
				id: 'collection_view_1',
				query2: {
					sort: [ tas ]
				}
			} as any,
			cache: ICache = {
				...NotionCacheObject.createDefaultCache(),
				block: new Map([ [ 'block_1', { collection_id: 'collection_1', id: 'block_1' } as any ] ]),
				collection: new Map([ [ 'collection_1', collection_1 ] ]),
				collection_view: new Map([ [ 'collection_view_1', collection_view_1 ] ])
			},
			stack: IOperation[] = [];

		const view = new View({
			...default_nishan_arg,
			cache,
			id: 'collection_view_1',
			stack
		});

		const sort = [
			{
				direction: 'descending',
				property: 'title'
			}
		];

		await view.updateSort([ 'Title', 'descending' ]);

		expect(collection_view_1.query2.sort).toStrictEqual(sort);
		expect(stack[0]).toStrictEqual(o.cv.s('collection_view_1', [ 'query2', 'sort' ], sort));
	});

	it(`pos=number`, async () => {
		const collection_1 = createCollection(),
			collection_view_1 = {
				parent_id: 'block_1',
				id: 'collection_view_1',
				query2: {
					sort: [ tas, txas ]
				}
			} as any,
			cache: ICache = {
				...NotionCacheObject.createDefaultCache(),
				block: new Map([ [ 'block_1', { collection_id: 'collection_1', id: 'block_1' } as any ] ]),
				collection: new Map([ [ 'collection_1', collection_1 ] ]),
				collection_view: new Map([ [ 'collection_view_1', collection_view_1 ] ])
			},
			stack: IOperation[] = [];

		const view = new View({
			...default_nishan_arg,
			cache,
			id: 'collection_view_1',
			stack
		});

		const sort = [ txas, tas ];

		await view.updateSort([ 'Title', 1 ]);

		expect(collection_view_1.query2.sort).toStrictEqual(sort);
		expect(stack[0]).toStrictEqual(o.cv.s('collection_view_1', [ 'query2', 'sort' ], sort));
	});

	it(`pos=[direction,number]`, async () => {
		const collection_1 = createCollection(),
			collection_view_1 = {
				parent_id: 'block_1',
				id: 'collection_view_1',
				query2: {
					sort: [ tas, txas ]
				}
			} as any,
			cache: ICache = {
				...NotionCacheObject.createDefaultCache(),
				block: new Map([ [ 'block_1', { collection_id: 'collection_1', id: 'block_1' } as any ] ]),
				collection: new Map([ [ 'collection_1', collection_1 ] ]),
				collection_view: new Map([ [ 'collection_view_1', collection_view_1 ] ])
			},
			stack: IOperation[] = [];

		const view = new View({
			...default_nishan_arg,
			cache,
			id: 'collection_view_1',
			stack
		});

		const sort = [
			txas,
			{
				property: 'title',
				direction: 'descending'
			}
		];

		await view.updateSort([ 'Title', [ 'descending', 1 ] ]);

		expect(collection_view_1.query2.sort).toStrictEqual(sort);
		expect(stack[0]).toStrictEqual(o.cv.s('collection_view_1', [ 'query2', 'sort' ], sort));
	});
});

it(`deleteSort`, async () => {
	const collection_1 = createCollection(),
		collection_view_1 = {
			parent_id: 'block_1',
			id: 'collection_view_1',
			query2: {
				sort: [ tas ]
			}
		} as any,
		cache: ICache = {
			...NotionCacheObject.createDefaultCache(),
			block: new Map([ [ 'block_1', { collection_id: 'collection_1', id: 'block_1' } as any ] ]),
			collection: new Map([ [ 'collection_1', collection_1 ] ]),
			collection_view: new Map([ [ 'collection_view_1', collection_view_1 ] ])
		},
		stack: IOperation[] = [];

	const view = new View({
		...default_nishan_arg,
		cache,
		id: 'collection_view_1',
		stack
	});

	const sort: any[] = [];

	await view.deleteSort('Title');

	expect(collection_view_1.query2.sort).toStrictEqual(sort);
	expect(stack[0]).toStrictEqual(o.cv.s('collection_view_1', [ 'query2', 'sort' ], sort));
});

describe('updateFormatProperty', () => {
	it(`format, width and position all given`, async () => {
		const collection_1 = createCollection(),
			collection_view_1 = {
				parent_id: 'block_1',
				id: 'collection_view_1',
				type: 'table',
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
			cache: ICache = {
				...NotionCacheObject.createDefaultCache(),
				block: new Map([ [ 'block_1', { collection_id: 'collection_1', id: 'block_1' } as any ] ]),
				collection: new Map([ [ 'collection_1', collection_1 ] ]),
				collection_view: new Map([ [ 'collection_view_1', collection_view_1 ] ])
			},
			stack: IOperation[] = [];

		const view = new View({
			...default_nishan_arg,
			cache,
			id: 'collection_view_1',
			stack
		});

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
		expect(stack[0]).toStrictEqual(o.cv.s('collection_view_1', [ 'format', 'table_properties' ], table_properties));
	});

	it(`format, width and position none given`, async () => {
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

		const collection_1 = createCollection(),
			collection_view_1 = {
				parent_id: 'block_1',
				id: 'collection_view_1',
				type: 'table',
				format: {
					table_properties
				}
			} as any,
			cache: ICache = {
				...NotionCacheObject.createDefaultCache(),
				block: new Map([ [ 'block_1', { collection_id: 'collection_1', id: 'block_1' } as any ] ]),
				collection: new Map([ [ 'collection_1', collection_1 ] ]),
				collection_view: new Map([ [ 'collection_view_1', collection_view_1 ] ])
			},
			stack: IOperation[] = [];

		const view = new View({
			...default_nishan_arg,
			cache,
			id: 'collection_view_1',
			stack
		});

		await view.updateFormatProperty([ 'Title', { type: 'table' } ]);

		expect(collection_view_1.format.table_properties).toStrictEqual(table_properties);
		expect(stack[0]).toStrictEqual(o.cv.s('collection_view_1', [ 'format', 'table_properties' ], table_properties));
	});

	it(`type!=table,format, width and position none given`, async () => {
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

		const collection_1 = createCollection(),
			collection_view_1 = {
				parent_id: 'block_1',
				id: 'collection_view_1',
				type: 'table',
				format: {
					table_properties
				}
			} as any,
			cache: ICache = {
				...NotionCacheObject.createDefaultCache(),
				block: new Map([ [ 'block_1', { collection_id: 'collection_1', id: 'block_1' } as any ] ]),
				collection: new Map([ [ 'collection_1', collection_1 ] ]),
				collection_view: new Map([ [ 'collection_view_1', collection_view_1 ] ])
			},
			stack: IOperation[] = [];

		const view = new View({
			...default_nishan_arg,
			cache,
			id: 'collection_view_1',
			stack
		});

		await view.updateFormatProperty([ 'Title', { type: 'list' } ]);

		expect(collection_view_1.format.table_properties).toStrictEqual(table_properties);
		expect(stack[0]).toStrictEqual(o.cv.s('collection_view_1', [ 'format', 'table_properties' ], table_properties));
	});
});

describe('createFilters', () => {
	it(`format, width and position all given`, async () => {
		const collection_1 = createCollection(),
			collection_view_1 = {
				parent_id: 'block_1',
				id: 'collection_view_1',
				type: 'table',
				query2: {}
			} as any,
			cache: ICache = {
				...NotionCacheObject.createDefaultCache(),
				block: new Map([ [ 'block_1', { collection_id: 'collection_1', id: 'block_1' } as any ] ]),
				collection: new Map([ [ 'collection_1', collection_1 ] ]),
				collection_view: new Map([ [ 'collection_view_1', collection_view_1 ] ])
			},
			stack: IOperation[] = [];

		const view = new View({
			...default_nishan_arg,
			cache,
			id: 'collection_view_1',
			stack
		});

		const filters = {
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
				}
			]
		};

		view.createFilters([
			{
				name: 'Title',
				type: 'title',
				filter: {
					operator: 'string_contains',
					value: {
						type: 'exact',
						value: 'Something'
					}
				}
			}
		]);

		expect(collection_view_1.query2.filter).toStrictEqual(filters);
		expect(stack).toStrictEqual([ o.cv.u('collection_view_1', [ 'query2', 'filter' ], filters) ]);
	});
});

describe('updateFilters', () => {
	it(`separate property and same position`, async () => {
		const collection_1 = createCollection(),
			collection_view_1 = {
				parent_id: 'block_1',
				id: 'collection_view_1',
				type: 'table',
				query2: {
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
							}
						]
					}
				}
			} as any,
			cache: ICache = {
				...NotionCacheObject.createDefaultCache(),
				block: new Map([ [ 'block_1', { collection_id: 'collection_1', id: 'block_1' } as any ] ]),
				collection: new Map([ [ 'collection_1', collection_1 ] ]),
				collection_view: new Map([ [ 'collection_view_1', collection_view_1 ] ])
			},
			stack: IOperation[] = [];

		const view = new View({
			...default_nishan_arg,
			cache,
			id: 'collection_view_1',
			stack
		});

		const filter_value = {
				operator: 'string_starts_with',
				value: {
					type: 'exact',
					value: 'Otherthing'
				}
			},
			filters = {
				operator: 'and',
				filters: [
					{
						property: 'text',
						filter: filter_value
					}
				]
			};

		await view.updateFilter([
			'0',
			{
				name: 'Text',
				type: 'text',
				filter: filter_value as any
			}
		]);

		expect(collection_view_1.query2.filter).toStrictEqual(filters);
		expect(stack[0]).toStrictEqual(o.cv.u('collection_view_1', [ 'query2', 'filter' ], filters));
	});

	it(`same property and different position`, async () => {
		const filter1 = {
				property: 'text',
				filter: {
					operator: 'string_is',
					value: {
						type: 'exact',
						value: 'Something'
					}
				}
			},
			collection_1 = createCollection(),
			collection_view_1 = {
				parent_id: 'block_1',
				id: 'collection_view_1',
				type: 'table',
				query2: {
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
							filter1
						]
					}
				}
			} as any,
			cache: ICache = {
				...NotionCacheObject.createDefaultCache(),
				block: new Map([ [ 'block_1', { collection_id: 'collection_1', id: 'block_1' } as any ] ]),
				collection: new Map([ [ 'collection_1', collection_1 ] ]),
				collection_view: new Map([ [ 'collection_view_1', collection_view_1 ] ])
			},
			stack: IOperation[] = [];

		const view = new View({
			...default_nishan_arg,
			cache,
			id: 'collection_view_1',
			stack
		});

		const filter_value = {
				operator: 'string_starts_with',
				value: {
					type: 'exact',
					value: 'Otherthing'
				}
			},
			filters = {
				operator: 'and',
				filters: [
					filter1,
					{
						property: 'title',
						filter: filter_value
					}
				]
			};

		await view.updateFilter([
			'0',
			{
				type: 'title',
				position: 1,
				filter: filter_value as any
			}
		]);

		expect(collection_view_1.query2.filter).toStrictEqual(filters);
		expect(stack[0]).toStrictEqual(o.cv.u('collection_view_1', [ 'query2', 'filter' ], filters));
	});
});

it(`deleteFilter`, async () => {
	const filter1 = {
			property: 'text',
			filter: {
				operator: 'string_is',
				value: {
					type: 'exact',
					value: 'Something'
				}
			}
		},
		collection_1 = createCollection(),
		collection_view_1 = {
			parent_id: 'block_1',
			id: 'collection_view_1',
			type: 'table',
			query2: {
				filter: {
					operator: 'and',
					filters: [ filter1 ]
				}
			}
		} as any,
		cache: ICache = {
			...NotionCacheObject.createDefaultCache(),
			block: new Map([ [ 'block_1', { collection_id: 'collection_1', id: 'block_1' } as any ] ]),
			collection: new Map([ [ 'collection_1', collection_1 ] ]),
			collection_view: new Map([ [ 'collection_view_1', collection_view_1 ] ])
		},
		stack: IOperation[] = [];

	const view = new View({
		...default_nishan_arg,
		cache,
		id: 'collection_view_1',
		stack
	});

	const filters = {
		operator: 'and',
		filters: []
	};

	await view.deleteFilter('0');

	expect(collection_view_1.query2.filter).toStrictEqual(filters);
	expect(stack[0]).toStrictEqual(o.cv.u('collection_view_1', [ 'query2', 'filter' ], filters));
});
