import { NotionCacheObject } from '@nishans/cache';
import { Mutations } from '@nishans/endpoints';
import { IOperation } from '@nishans/types';
import { v4 } from 'uuid';
import { Block, NotionData, PopulateMap } from '../../../libs';
import { default_nishan_arg, last_edited_props, o } from '../../utils';

afterEach(() => {
	jest.restoreAllMocks();
});

it('getCachedParentData', () => {
	const cache = {
		...NotionCacheObject.createDefaultCache(),
		block: new Map([
			[ 'block_1', { id: 'block_1', parent_table: 'block', parent_id: 'block_2' } ],
			[ 'block_2', { id: 'block_2' } ]
		])
	} as any;

	const block = new Block({
		...default_nishan_arg,
		cache
	});

	const cached_parent_data = block.getCachedParentData();
	expect(cached_parent_data).toStrictEqual({
		id: 'block_2'
	});
});

it('reposition', () => {
	const cache = {
		...NotionCacheObject.createDefaultCache(),
		block: new Map([
			[ 'block_1', { id: 'block_1', parent_table: 'block', parent_id: 'block_2' } ],
			[ 'block_2', { id: 'block_2' } ]
		])
	} as any;

	const block = new Block({
		cache,
		id: 'block_1',
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		stack: [],
		token: 'token',
		user_id: 'user_root_1'
	});

	const addToChildArrayMock = jest
		.spyOn(NotionData.prototype, 'addToChildArray' as any)
		.mockImplementationOnce(() => undefined);

	block.reposition(0);
	expect(addToChildArrayMock).toHaveBeenLastCalledWith('block', { id: 'block_2' }, 0);
});

it('update', () => {
	const block_1: any = { id: 'block_1' },
		cache = {
			...NotionCacheObject.createDefaultCache(),
			block: new Map([ [ 'block_1', block_1 ] ])
		} as any,
		stack: IOperation[] = [];

	const logger_spy = jest.fn();
	const block = new Block({
		...default_nishan_arg,
		cache,
		stack,
		logger: logger_spy
	});

	block.update({
		properties: {
			title: [ [ 'New Title' ] ]
		}
	});

	expect(block_1).toStrictEqual({
		...block_1,
		properties: {
			title: [ [ 'New Title' ] ]
		}
	});

	expect(logger_spy).toHaveBeenCalledWith('UPDATE', 'block', 'block_1');
	expect(stack).toEqual([
		o.b.u(
			'block_1',
			[],
			expect.objectContaining({
				properties: {
					title: [ [ 'New Title' ] ]
				}
			})
		)
	]);
});

describe('duplicate', () => {
	it(`type=header,arg=number`, async () => {
		const block_1: any = { id: 'block_1', type: 'header' },
			cache = {
				...NotionCacheObject.createDefaultCache(),
				block: new Map([ [ 'block_1', block_1 ] ])
			} as any,
			stack: IOperation[] = [];

		const logger_spy = jest.fn();
		const block = new Block({
			...default_nishan_arg,
			cache,
			stack,
			logger: logger_spy
		});

		const id = v4();
		const PopulateMapBlockMock = jest.spyOn(PopulateMap, 'block').mockImplementation(async () => undefined);
		const cached_data = {
			id,
			copied_from: 'block_1',
			type: 'header'
		};

		await block.duplicate([ id ]);
		expect(cache.block.get(id)).toStrictEqual(cached_data);
		expect(logger_spy).toHaveBeenCalledWith('CREATE', 'block', id);
		expect(PopulateMapBlockMock).toHaveBeenCalledTimes(1);
		expect(stack).toEqual([ o.b.u(id, [], expect.objectContaining(cached_data)) ]);
	});

	it(`type=collection_view_page,arg=number`, async () => {
		const block_1: any = { parent_id: 'block_2', id: 'block_1', type: 'collection_view_page' },
			cache = {
				...NotionCacheObject.createDefaultCache(),
				block: new Map([ [ 'block_1', block_1 ] ])
			} as any,
			stack: IOperation[] = [];

		const logger_spy = jest.fn();
		const block = new Block({
			...default_nishan_arg,
			cache,
			stack,
			logger: logger_spy
		});

		const PopulateMapBlockMock = jest.spyOn(PopulateMap, 'block').mockImplementation(async () => undefined);
		const MutationsEnqueueTaskMock = jest
			.spyOn(Mutations, 'enqueueTask')
			.mockImplementation(async () => undefined as any);
		const cached_data = {
			id: expect.any(String),
			type: 'copy_indicator',
			parent_id: 'block_2',
			parent_table: 'block',
			alive: true
		};

		await block.duplicate(1);
		expect(logger_spy).toHaveBeenCalledWith('CREATE', 'block', expect.any(String));

		expect(PopulateMapBlockMock).toHaveBeenCalledTimes(1);
		expect(stack).toEqual([ o.b.u(expect.any(String), [], expect.objectContaining(cached_data)) ]);
		expect(MutationsEnqueueTaskMock).toHaveBeenCalledWith(
			{
				task: {
					eventName: 'duplicateBlock',
					request: {
						sourceBlockId: 'block_1',
						targetBlockId: expect.any(String),
						addCopyName: true
					}
				}
			},
			expect.objectContaining({
				token: 'token',
				user_id: 'user_root_1',
				interval: 0
			})
		);
	});
});

it('convertTo', () => {
	const block_1: any = { id: 'block_1' },
		cache = {
			...NotionCacheObject.createDefaultCache(),
			block: new Map([ [ 'block_1', block_1 ] ])
		} as any,
		stack: IOperation[] = [];

	const logger_spy = jest.fn();
	const block = new Block({
		...default_nishan_arg,
		cache,
		stack,
		logger: logger_spy
	});

	block.convertTo('header');

	expect(block_1).toStrictEqual({
		...block_1,
		type: 'header'
	});

	expect(stack).toEqual([
		o.b.u(
			'block_1',
			[],
			expect.objectContaining({
				type: 'header'
			})
		)
	]);

	expect(logger_spy).toHaveBeenCalledWith('UPDATE', 'block', 'block_1');
});

it(`delete`, () => {
	const block_1: any = { id: 'block_1', parent_table: 'space', parent_id: 'space_1' },
		cache = {
			...NotionCacheObject.createDefaultCache(),
			block: new Map([ [ 'block_1', block_1 ] ]),
			space: new Map([ [ 'space_1', { id: 'space_1', pages: [ 'space_1' ] } ] ])
		} as any,
		stack: IOperation[] = [];

	const logger_spy = jest.fn();
	const block = new Block({
		...default_nishan_arg,
		cache,
		stack,
		logger: logger_spy
	});

	block.delete();
	expect(logger_spy).toHaveBeenCalledTimes(2);
	expect(logger_spy).toHaveBeenNthCalledWith(1, 'UPDATE', 'block', 'block_1');
	expect(logger_spy).toHaveBeenNthCalledWith(2, 'UPDATE', 'space', 'space_1');
	expect(block_1).toEqual(
		expect.objectContaining({
			...block_1,
			alive: false
		})
	);
	expect(stack).toEqual([
		o.b.u(
			'block_1',
			[],
			expect.objectContaining({
				alive: false
			})
		),
		o.s.lr('space_1', [ 'pages' ], {
			id: 'block_1'
		}),
		o.s.u('space_1', [], last_edited_props)
	]);
});

it(`transfer`, async () => {
	const block_1: any = { id: 'block_1', parent_table: 'block', parent_id: 'block_2' },
		block_2: any = { id: 'block_2', content: [ 'block_1' ] },
		block_3: any = { id: 'block_3', content: [] },
		cache = {
			...NotionCacheObject.createDefaultCache(),
			block: new Map([ [ 'block_1', block_1 ], [ 'block_2', block_2 ], [ 'block_3', block_3 ] ])
		} as any,
		stack: IOperation[] = [];

	const logger_spy = jest.fn();
	const block = new Block({
		...default_nishan_arg,
		cache,
		stack,
		logger: logger_spy
	});

	await block.transfer('block_3');
	expect(logger_spy).toHaveBeenCalledTimes(3);
	expect(logger_spy).toHaveBeenNthCalledWith(1, 'UPDATE', 'block', 'block_1');
	expect(logger_spy).toHaveBeenNthCalledWith(2, 'UPDATE', 'block', 'block_2');
	expect(logger_spy).toHaveBeenNthCalledWith(3, 'UPDATE', 'block', 'block_3');

	expect(block_1.parent_id).toBe('block_3');
	expect(block_2.content).toEqual([]);
	expect(block_3.content).toEqual([ 'block_1' ]);

	expect(stack).toEqual([
		o.b.u(
			'block_1',
			[],
			expect.objectContaining({
				alive: true,
				parent_table: 'block',
				parent_id: 'block_3'
			})
		),
		o.b.lr(
			'block_2',
			[ 'content' ],
			expect.objectContaining({
				id: 'block_1'
			})
		),
		o.b.la(
			'block_3',
			[ 'content' ],
			expect.objectContaining({
				id: 'block_1'
			})
		),
		o.b.u('block_2', [], last_edited_props),
		o.b.u('block_3', [], last_edited_props)
	]);
});
