import { NotionCache } from '@nishans/cache';
import { IPageUpdateInput } from '@nishans/fabricator';
import { NotionLogger } from '@nishans/logger';
import { NotionTraverser } from '@nishans/traverser';
import { IHeader } from '@nishans/types';
import { createExecuteOperationsMock } from '../../../../utils/tests';
import { NotionCore } from '../../libs';
import { default_nishan_arg, last_edited_props, o } from '../utils';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('constructor', () => {
	it(`default cache, interval and token not provided`, () => {
		expect(
			() =>
				new NotionCore.Api.NotionData({
					id: 'block_1',
					shard_id: 123,
					space_id: 'space_1',
					type: 'block',
					user_id: 'notion_user_1'
				} as any)
		).toThrow();
	});
});

it(`getLastEditedProps`, async () => {
	const cache = {
		...NotionCache.createDefaultCache(),
		block: new Map([ [ 'block_1', { id: 'block_1' } ] ])
	} as any;

	const block = new NotionCore.Api.NotionData({
		...default_nishan_arg,
		cache,
		type: 'block'
	});

	const last_edited_props = (block as any).getLastEditedProps();
	expect(last_edited_props).toStrictEqual(last_edited_props);
});

it(`updateLastEditedProps`, async () => {
	const cache = {
		...NotionCache.createDefaultCache(),
		block: new Map([ [ 'block_1', { id: 'block_1' } ], [ 'block_2', { id: 'block_2' } ] ])
	} as any;

	const block = new NotionCore.Api.NotionData({
		...default_nishan_arg,
		cache,
		type: 'block'
	});

	const updated_last_edited_props = (block as any).updateLastEditedProps();
	(block as any).updateLastEditedProps(cache.block.get('block_2'));

	expect(cache.block.get('block_1')).toStrictEqual({
		id: 'block_1',
		...last_edited_props
	});
	expect(updated_last_edited_props).toStrictEqual(last_edited_props);
	expect(cache.block.get('block_2')).toStrictEqual({
		id: 'block_2',
		...last_edited_props
	});
});

describe('getCachedData', () => {
	it(`data exists`, async () => {
		const cache = {
			...NotionCache.createDefaultCache(),
			block: new Map([ [ 'block_1', { id: 'block_1' } ] ])
		} as any;

		const block = new NotionCore.Api.NotionData({
			...default_nishan_arg,
			cache,
			type: 'block'
		});
		const cached_data = block.getCachedData();
		expect(cached_data).toStrictEqual({
			id: 'block_1'
		});
	});

	it(`data doesn't exists`, async () => {
		const cache = {
			...NotionCache.createDefaultCache(),
			block: new Map([ [ 'block_1', { id: 'block_1' } ] ])
		} as any;

		const loggerMethodMock = jest.spyOn(NotionLogger.method, 'warn');

		const block = new NotionCore.Api.NotionData({
			...default_nishan_arg,
			cache,
			type: 'block',
			id: 'block_2'
		});
		block.getCachedData();
		expect(loggerMethodMock).toHaveBeenCalledTimes(1);
		expect(loggerMethodMock).toHaveBeenCalledWith(`block:block_2 doesnot exist in the cache`);
	});

	it(`data is not alive`, async () => {
		const cache = {
			...NotionCache.createDefaultCache(),
			block: new Map([ [ 'block_1', { id: 'block_1', alive: false } ] ])
		} as any;

		const loggerMethodMock = jest.spyOn(NotionLogger.method, 'warn');

		const block = new NotionCore.Api.NotionData({
			...default_nishan_arg,
			cache,
			type: 'block'
		});
		block.getCachedData();
		expect(loggerMethodMock).toHaveBeenCalledTimes(1);
		expect(loggerMethodMock).toHaveBeenCalledWith(`block:block_1 is not alive`);
	});
});

it(`updateCachedData`, async () => {
	const cache = {
		...NotionCache.createDefaultCache(),
		block: new Map([ [ 'block_1', { id: 'block_1', alive: false } ] ])
	} as any;

	const block = new NotionCore.Api.NotionData({
		...default_nishan_arg,
		cache,
		type: 'block'
	});

	const updateCacheManuallyMock = jest.spyOn(NotionCache, 'updateCacheManually').mockImplementationOnce(() => {
		return {} as any;
	});
	await block.updateCachedData();
	expect(updateCacheManuallyMock).toHaveBeenCalledTimes(1);
	expect(updateCacheManuallyMock.mock.calls[0][0]).toStrictEqual([ [ 'block_1', 'block' ] ]);
});

it(`deleteCachedData`, async () => {
	const cache = {
		...NotionCache.createDefaultCache(),
		block: new Map([ [ 'block_1', { id: 'block_1', alive: false } ] ])
	} as any;

	const block = new NotionCore.Api.NotionData({
		...default_nishan_arg,
		cache,
		type: 'block'
	});

	(block as any).deleteCachedData();
	expect(cache.block.get('block_1')).toBeUndefined();
});

it(`update`, async () => {
	const block_1 = { id: 'block_1', type: 'header' },
		cache = {
			...NotionCache.createDefaultCache(),
			block: new Map([ [ 'block_1', block_1 ] ])
		} as any,
		methodLogger = jest.spyOn(NotionLogger.method, 'info'),
		{ e1 } = createExecuteOperationsMock();

	const block = new NotionCore.Api.NotionData<IHeader, Partial<Pick<IHeader, 'alive'>>>({
		...default_nishan_arg,
		cache,
		type: 'block'
	});

	await block.update({ alive: false });
	expect(methodLogger).toHaveBeenCalledWith(`UPDATE block block_1`);
	expect(block.getCachedData()).toStrictEqual(block_1);
	e1([ o.b.u('block_1', [], { alive: false, ...last_edited_props }) ]);
});

it(`getProps`, () => {
	const cache = {
		...NotionCache.createDefaultCache(),
		block: new Map([ [ 'block_1', { id: 'block_1', type: 'header' } ] ])
	} as any;

	const block = new NotionCore.Api.NotionData<IHeader, IPageUpdateInput>({
		...default_nishan_arg,
		cache,
		type: 'block'
	});

	expect(block.getProps()).toStrictEqual(
		expect.objectContaining({
			token: 'token',
			interval: 0,
			user_id: 'user_root_1',
			shard_id: 123,
			space_id: 'space_1',
			notion_operation_plugins: []
		})
	);
});

it(`getIterate`, async () => {
	const cache = {
		...NotionCache.createDefaultCache(),
		block: new Map([ [ 'block_1', { id: 'block_1' } ], [ 'block_2', { id: 'block_2' } ] ])
	} as any;

	const block = new NotionCore.Api.NotionData({
		...default_nishan_arg,
		cache,
		type: 'block'
	});

	const initializeCacheForThisDataMock = jest
		.spyOn(NotionCore.Api.NotionData.prototype, 'initializeCacheForThisData')
		.mockImplementationOnce(() => {
			return {} as any;
		});

	const NotionTraverserGetMock = jest.spyOn(NotionTraverser, 'get').mockImplementation(() => {
		return {} as any;
	});

	await (block as any).getIterate();
	expect(initializeCacheForThisDataMock).toHaveBeenCalledTimes(1);
	expect(NotionTraverserGetMock).toHaveBeenCalledTimes(1);
});

it(`updateIterate`, async () => {
	const cache = {
		...NotionCache.createDefaultCache(),
		block: new Map([ [ 'block_1', { id: 'block_1' } ], [ 'block_2', { id: 'block_2' } ] ])
	} as any;

	const block = new NotionCore.Api.NotionData({
		...default_nishan_arg,
		cache,
		type: 'block'
	});

	const initializeCacheForThisDataMock = jest
		.spyOn(NotionCore.Api.NotionData.prototype, 'initializeCacheForThisData')
		.mockImplementationOnce(() => {
			return {} as any;
		});

	const NotionTraverserUpdateMock = jest.spyOn(NotionTraverser, 'update').mockImplementationOnce(() => {
		return {} as any;
	});

	await (block as any).updateIterate();
	expect(initializeCacheForThisDataMock).toHaveBeenCalledTimes(1);
	expect(NotionTraverserUpdateMock).toHaveBeenCalledTimes(1);
});

it(`deleteIterate`, async () => {
	const cache = {
		...NotionCache.createDefaultCache(),
		block: new Map([ [ 'block_1', { id: 'block_1' } ], [ 'block_2', { id: 'block_2' } ] ])
	} as any;

	const block = new NotionCore.Api.NotionData({
		...default_nishan_arg,
		cache,
		type: 'block'
	});

	const initializeCacheForThisDataMock = jest
		.spyOn(NotionCore.Api.NotionData.prototype, 'initializeCacheForThisData')
		.mockImplementation(async () => undefined);

	const NotionTraverserDeleteMock = jest.spyOn(NotionTraverser, 'delete').mockImplementationOnce(() => {
		return {} as any;
	});

	await (block as any).deleteIterate();
	expect(initializeCacheForThisDataMock).toHaveBeenCalledTimes(1);
	expect(NotionTraverserDeleteMock).toHaveBeenCalledTimes(1);
});
