import { NotionCache } from '@nishans/cache';
import { NotionMutations } from '@nishans/endpoints';
import { NotionOperationsObject } from '@nishans/operations';
import { v4 } from 'uuid';
import { Block, NotionData, PopulateMap } from '../../../libs';
import { default_nishan_arg, last_edited_props, o } from '../../utils';

afterEach(() => {
	jest.restoreAllMocks();
});

const construct = () => {
	const block_1: any = {
			type: 'header',
			id: 'block_1',
			properties: { title: [ [ 'Title' ] ] },
			format: { page_full_width: false },
			parent_id: 'block_3',
			parent_table: 'block'
		},
		block_2: any = { parent_id: 'block_3', id: 'block_2', type: 'collection_view_page' },
		block_3: any = { parent_id: 'space_1', id: 'block_3', type: 'page', content: [ 'block_1', 'block_2' ] },
		block_4: any = { parent_id: 'space_1', id: 'block_4', type: 'page', content: [] },
		cache = {
			...NotionCache.createDefaultCache(),
			block: new Map([ [ 'block_1', block_1 ], [ 'block_2', block_2 ], [ 'block_3', block_3 ], [ 'block_4', block_4 ] ])
		} as any,
		executeOperationsMock = jest
			.spyOn(NotionOperationsObject, 'executeOperations')
			.mockImplementation(async () => undefined);

	const logger_spy = jest.fn();
	const block = new Block({
		...default_nishan_arg,
		cache,
		logger: logger_spy
	});

	return { block_4, block_3, block_2, block, executeOperationsMock, block_1, cache, logger_spy };
};

it('getCachedParentData', async () => {
	const cache = {
		...NotionCache.createDefaultCache(),
		block: new Map([
			[ 'block_1', { id: 'block_1', parent_table: 'block', parent_id: 'block_2' } ],
			[ 'block_2', { id: 'block_2' } ]
		])
	} as any;

	const block = new Block({
		...default_nishan_arg,
		cache
	});

	const cached_parent_data = await block.getCachedParentData();
	expect(cached_parent_data).toStrictEqual({
		id: 'block_2'
	});
});

it('reposition', async () => {
	const cache = {
		...NotionCache.createDefaultCache(),
		block: new Map([
			[ 'block_1', { id: 'block_1', parent_table: 'block', parent_id: 'block_2' } ],
			[ 'block_2', { id: 'block_2' } ]
		])
	} as any;

	const block = new Block({
		...default_nishan_arg,
		cache
	});

	const addToChildArrayMock = jest
		.spyOn(NotionData.prototype, 'addToChildArray' as any)
		.mockImplementationOnce(() => undefined);

	await block.reposition(0);
	expect(addToChildArrayMock).toHaveBeenLastCalledWith('block', { id: 'block_2' }, 0);
});

it('update', async () => {
	const { block, executeOperationsMock, block_1, logger_spy } = construct();

	await block.update({
		properties: {
			title: [ [ 'New Title' ] ]
		}
	});

	expect(block_1).toStrictEqual(
		expect.objectContaining({
			properties: {
				title: [ [ 'New Title' ] ]
			}
		})
	);
	expect(logger_spy).toHaveBeenCalledWith('UPDATE', 'block', 'block_1');
	expect(executeOperationsMock.mock.calls[0][0]).toEqual([
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
		const { block, executeOperationsMock, cache, logger_spy } = construct();

		const id = v4();
		const cached_data = {
			id,
			copied_from: 'block_1',
			type: 'header'
		};

		await block.duplicate([ id ]);
		expect(cache.block.get(id)).toStrictEqual(expect.objectContaining(cached_data));
		expect(logger_spy).toHaveBeenCalledWith('CREATE', 'block', id);
		expect(executeOperationsMock.mock.calls[0][0]).toEqual([ o.b.u(id, [], expect.objectContaining(cached_data)) ]);
	});

	it(`type=collection_view_page,arg=number`, async () => {
		const { cache, executeOperationsMock } = construct();

		const block = new Block({
			...default_nishan_arg,
			id: 'block_2',
			cache
		});

		const PopulateMapBlockMock = jest.spyOn(PopulateMap, 'block').mockImplementation(async () => undefined);
		const NotionMutationsEnqueueTaskMock = jest
			.spyOn(NotionMutations, 'enqueueTask')
			.mockImplementation(async () => undefined as any);

		const cached_data = {
			id: expect.any(String),
			type: 'copy_indicator',
			parent_id: 'block_3',
			parent_table: 'block',
			alive: true
		};

		await block.duplicate(1);

		expect(PopulateMapBlockMock).toHaveBeenCalledTimes(1);
		expect(executeOperationsMock.mock.calls[0][0]).toEqual([
			o.b.u(expect.any(String), [], expect.objectContaining(cached_data))
		]);
		expect(NotionMutationsEnqueueTaskMock).toHaveBeenCalledWith(
			{
				task: {
					eventName: 'duplicateBlock',
					request: {
						sourceBlockId: 'block_2',
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

it('convertTo', async () => {
	const { block_1, block, logger_spy, executeOperationsMock } = construct();

	await block.convertTo('page');

	expect(block_1).toStrictEqual(
		expect.objectContaining({
			type: 'page'
		})
	);

	expect(executeOperationsMock.mock.calls[0][0]).toEqual([
		o.b.u('block_1', [ 'type' ], 'page'),
		o.b.u('block_1', [], last_edited_props)
	]);

	expect(logger_spy).toHaveBeenCalledWith('UPDATE', 'block', 'block_1');
});

it(`delete`, async () => {
	const { block_1, block, logger_spy, executeOperationsMock } = construct();

	await block.delete();

	expect(logger_spy).toHaveBeenCalledTimes(2);
	expect(logger_spy).toHaveBeenNthCalledWith(1, 'DELETE', 'block', 'block_1');
	expect(logger_spy).toHaveBeenNthCalledWith(2, 'UPDATE', 'block', 'block_3');
	expect(block_1).toEqual(
		expect.objectContaining({
			alive: false
		})
	);
	expect(executeOperationsMock).toHaveBeenCalledTimes(2);
	expect(executeOperationsMock.mock.calls[1][0]).toEqual([
		o.b.u(
			'block_1',
			[],
			expect.objectContaining({
				alive: false
			})
		),
		o.b.u('block_3', [], last_edited_props)
	]);
});

it(`transfer`, async () => {
	const { block_1, block_3, block_4, block, logger_spy, executeOperationsMock } = construct();

	await block.transfer('block_4');

	expect(logger_spy).toHaveBeenCalledTimes(3);
	expect(logger_spy).toHaveBeenNthCalledWith(1, 'UPDATE', 'block', 'block_1');
	expect(logger_spy).toHaveBeenNthCalledWith(2, 'UPDATE', 'block', 'block_3');
	expect(logger_spy).toHaveBeenNthCalledWith(3, 'UPDATE', 'block', 'block_4');

	expect(block_1.parent_id).toBe('block_4');
	expect(block_3.content).toEqual([ 'block_2' ]);
	expect(block_4.content).toEqual([ 'block_1' ]);

	expect(executeOperationsMock.mock.calls[0][0]).toEqual([
		o.b.u(
			'block_1',
			[],
			expect.objectContaining({
				parent_table: 'block',
				parent_id: 'block_4'
			})
		),
		o.b.lr(
			'block_3',
			[ 'content' ],
			expect.objectContaining({
				id: 'block_1'
			})
		),
		o.b.la(
			'block_4',
			[ 'content' ],
			expect.objectContaining({
				id: 'block_1'
			})
		),
		o.b.u('block_3', [], last_edited_props),
		o.b.u('block_4', [], last_edited_props)
	]);
});
