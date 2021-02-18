import { ICache } from '@nishans/cache';
import { IOperation } from '@nishans/types';
import { View } from '../../../src';
import Data from '../../../src/Data';
import { createDefaultCache } from '../../createDefaultCache';
import { default_nishan_arg } from '../../defaultNishanArg';
import { last_edited_props } from '../../lastEditedProps';

afterEach(() => {
	jest.restoreAllMocks();
});

it('getCollection', () => {
	const collection_1 = {
			schema: {
				title: {
					type: 'title',
					name: 'Title'
				}
			}
		} as any,
		collection_view_1 = { parent_id: 'block_1', id: 'collection_view_1' } as any,
		cache = {
			...createDefaultCache(),
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
			...createDefaultCache(),
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
			...createDefaultCache(),
			block: new Map([ [ 'block_1', block_1 ] ]),
			collection_view: new Map([ [ 'collection_view_1', collection_view_1 ] ])
		} as any,
		stack: IOperation[] = [];

	const addToChildArrayMock = jest
		.spyOn(Data.prototype, 'addToChildArray' as any)
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
			...createDefaultCache(),
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
		{
			command: 'update',
			table: 'collection_view',
			path: [],
			id: 'collection_view_1',
			args: {
				alive: false,
				...last_edited_props
			}
		}
	]);
});

describe('createSorts', () => {
	it(`pos=undefined`, () => {
		const collection_1: any = {
				id: 'collection_1',
				schema: {
					title: {
						name: 'Title',
						property: 'title'
					}
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
				...createDefaultCache(),
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
				direction: 'ascending',
				property: 'title'
			}
		];

		view.createSorts([ [ 'Title', 'ascending' ] ]);

		expect(collection_view_1.query2.sort).toStrictEqual(sort);
		expect(stack).toStrictEqual([
			{
				table: 'collection_view',
				command: 'update',
				id: 'collection_view_1',
				path: [ 'query2', 'sort' ],
				args: sort
			}
		]);
	});

	it(`pos=number`, () => {
		const collection_1: any = {
				id: 'collection_1',
				schema: {
					title: {
						name: 'Title',
						type: 'title'
					},
					text: {
						name: 'Text',
						type: 'text'
					}
				}
			},
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
				...createDefaultCache(),
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
				direction: 'ascending',
				property: 'text'
			},
			{
				direction: 'descending',
				property: 'title'
			}
		];

		view.createSorts([ [ 'Text', 'ascending', 0 ] ]);

		expect(collection_view_1.query2.sort).toStrictEqual(sort);
		expect(stack).toStrictEqual([
			{
				table: 'collection_view',
				command: 'update',
				id: 'collection_view_1',
				path: [ 'query2', 'sort' ],
				args: sort
			}
		]);
	});

	it(`throws error when property already has a sort `, () => {
		const collection_1: any = {
				id: 'collection_1',
				schema: {
					title: {
						name: 'Title',
						type: 'title'
					},
					text: {
						name: 'Text',
						type: 'text'
					}
				}
			},
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
				...createDefaultCache(),
				block: new Map([ [ 'block_1', { collection_id: 'collection_1', id: 'block_1' } as any ] ]),
				collection: new Map([ [ 'collection_1', collection_1 ] ]),
				collection_view: new Map([ [ 'collection_view_1', collection_view_1 ] ])
			};

		const view = new View({
			...default_nishan_arg,
			cache,
			id: 'collection_view_1'
		});

		expect(() => view.createSorts([ [ 'Title', 'ascending', 0 ] ])).toThrow(
			`Property Title already has sort descending`
		);
	});

	it(`throws error when property doesnot exist in the schema_map `, () => {
		const collection_1: any = {
				id: 'collection_1',
				schema: {
					title: {
						name: 'Title',
						type: 'title'
					}
				}
			},
			collection_view_1 = {
				parent_id: 'block_1',
				id: 'collection_view_1'
			} as any,
			cache: ICache = {
				...createDefaultCache(),
				block: new Map([ [ 'block_1', { collection_id: 'collection_1', id: 'block_1' } as any ] ]),
				collection: new Map([ [ 'collection_1', collection_1 ] ]),
				collection_view: new Map([ [ 'collection_view_1', collection_view_1 ] ])
			};

		const view = new View({
			...default_nishan_arg,
			cache,
			id: 'collection_view_1'
		});

		expect(() => view.createSorts([ [ 'Text', 'ascending', 0 ] ])).toThrow(`Unknown property Text referenced in [0]`);
	});
});

describe('updateSort', () => {
	it(`pos=undefined`, async () => {
		const collection_1: any = {
				id: 'collection_1',
				schema: {
					title: {
						name: 'Title',
						type: 'title'
					}
				}
			},
			collection_view_1 = {
				parent_id: 'block_1',
				id: 'collection_view_1',
				query2: {
					sort: [
						{
							property: 'title',
							direction: 'ascending'
						}
					]
				}
			} as any,
			cache: ICache = {
				...createDefaultCache(),
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
		expect(stack[1]).toStrictEqual({
			table: 'collection_view',
			command: 'update',
			id: 'collection_view_1',
			path: [ 'query2', 'sort' ],
			args: sort
		});
	});

	it(`pos=number`, async () => {
		const collection_1: any = {
				id: 'collection_1',
				schema: {
					title: {
						name: 'Title',
						type: 'title'
					},
					text: {
						name: 'Text',
						type: 'text'
					}
				}
			},
			collection_view_1 = {
				parent_id: 'block_1',
				id: 'collection_view_1',
				query2: {
					sort: [
						{
							property: 'title',
							direction: 'ascending'
						},
						{
							property: 'text',
							direction: 'ascending'
						}
					]
				}
			} as any,
			cache: ICache = {
				...createDefaultCache(),
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
				direction: 'ascending',
				property: 'text'
			},
			{
				property: 'title',
				direction: 'ascending'
			}
		];

		await view.updateSort([ 'Title', 1 ]);

		expect(collection_view_1.query2.sort).toStrictEqual(sort);
		expect(stack[1]).toStrictEqual({
			table: 'collection_view',
			command: 'update',
			id: 'collection_view_1',
			path: [ 'query2', 'sort' ],
			args: sort
		});
	});

	it(`pos=[direction,number]`, async () => {
		const collection_1: any = {
				id: 'collection_1',
				schema: {
					title: {
						name: 'Title',
						type: 'title'
					},
					text: {
						name: 'Text',
						type: 'text'
					}
				}
			},
			collection_view_1 = {
				parent_id: 'block_1',
				id: 'collection_view_1',
				query2: {
					sort: [
						{
							property: 'title',
							direction: 'ascending'
						},
						{
							property: 'text',
							direction: 'ascending'
						}
					]
				}
			} as any,
			cache: ICache = {
				...createDefaultCache(),
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
				direction: 'ascending',
				property: 'text'
			},
			{
				property: 'title',
				direction: 'descending'
			}
		];

		await view.updateSort([ 'Title', [ 'descending', 1 ] ]);

		expect(collection_view_1.query2.sort).toStrictEqual(sort);
		expect(stack[1]).toStrictEqual({
			table: 'collection_view',
			command: 'update',
			id: 'collection_view_1',
			path: [ 'query2', 'sort' ],
			args: sort
		});
	});
});

it(`deleteSort`, async () => {
	const collection_1: any = {
			id: 'collection_1',
			schema: {
				title: {
					name: 'Title',
					type: 'title'
				}
			}
		},
		collection_view_1 = {
			parent_id: 'block_1',
			id: 'collection_view_1',
			query2: {
				sort: [
					{
						property: 'title',
						direction: 'ascending'
					}
				]
			}
		} as any,
		cache: ICache = {
			...createDefaultCache(),
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
	expect(stack[1]).toStrictEqual({
		table: 'collection_view',
		command: 'update',
		id: 'collection_view_1',
		path: [ 'query2', 'sort' ],
		args: sort
	});
});

describe('updateFormatProperty', () => {
	it(`format, width and position all given`, async () => {
		const collection_1: any = {
				id: 'collection_1',
				schema: {
					title: {
						name: 'Title',
						type: 'title'
					},
					text: {
						name: 'Text',
						type: 'text'
					}
				}
			},
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
				...createDefaultCache(),
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
		await view.updateFormatProperty([ 'Title', { position: 1, visible: false, width: 125 } ]);

		expect(collection_view_1.format.table_properties).toStrictEqual(table_properties);
		expect(stack[1]).toStrictEqual({
			table: 'collection_view',
			command: 'update',
			id: 'collection_view_1',
			path: [ 'format', 'table_properties' ],
			args: table_properties
		});
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

		const collection_1: any = {
				id: 'collection_1',
				schema: {
					title: {
						name: 'Title',
						type: 'title'
					},
					text: {
						name: 'Text',
						type: 'text'
					}
				}
			},
			collection_view_1 = {
				parent_id: 'block_1',
				id: 'collection_view_1',
				type: 'table',
				format: {
					table_properties
				}
			} as any,
			cache: ICache = {
				...createDefaultCache(),
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

		await view.updateFormatProperty([ 'Title', {} ]);

		expect(collection_view_1.format.table_properties).toStrictEqual(table_properties);
		expect(stack[1]).toStrictEqual({
			table: 'collection_view',
			command: 'update',
			id: 'collection_view_1',
			path: [ 'format', 'table_properties' ],
			args: table_properties
		});
	});
});

describe('createFilters', () => {
	it(`format, width and position all given`, async () => {
		const collection_1: any = {
				id: 'collection_1',
				schema: {
					title: {
						name: 'Title',
						type: 'title'
					},
					text: {
						name: 'Text',
						type: 'text'
					}
				}
			},
			collection_view_1 = {
				parent_id: 'block_1',
				id: 'collection_view_1',
				type: 'table',
				query2: {}
			} as any,
			cache: ICache = {
				...createDefaultCache(),
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
		expect(stack).toStrictEqual([
			{
				table: 'collection_view',
				command: 'update',
				id: 'collection_view_1',
				path: [ 'query2', 'filter' ],
				args: filters
			}
		]);
	});
});
