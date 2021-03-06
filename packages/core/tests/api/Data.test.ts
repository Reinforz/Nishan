import { NotionCache } from '@nishans/cache';
import { NotionOperations } from '@nishans/operations';
import { IHeader } from '@nishans/types';
import colors from 'colors';
import { ChildTraverser, NotionData } from '../../libs';
import { default_nishan_arg, last_edited_props, o } from '../utils';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`getLastEditedProps`, async () => {
	const cache = {
		...NotionCache.createDefaultCache(),
		block: new Map([ [ 'block_1', { id: 'block_1' } ] ])
	} as any;

	const block = new NotionData({
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

	const block = new NotionData({
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

		const block = new NotionData({
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

		const consoleLogSpy = jest.spyOn(console, 'log');

		const block = new NotionData({
			...default_nishan_arg,
			cache,
			type: 'block',
			id: 'block_2'
		});
		block.getCachedData();
		expect(consoleLogSpy).toHaveBeenCalledTimes(1);
		expect(consoleLogSpy).toHaveBeenCalledWith(colors.yellow.bold(`block:block_2 doesnot exist in the cache`));
	});

	it(`data is not alive`, async () => {
		const cache = {
			...NotionCache.createDefaultCache(),
			block: new Map([ [ 'block_1', { id: 'block_1', alive: false } ] ])
		} as any;

		const consoleLogSpy = jest.spyOn(console, 'log');

		const block = new NotionData({
			...default_nishan_arg,
			cache,
			type: 'block'
		});
		block.getCachedData();
		expect(consoleLogSpy).toHaveBeenCalledTimes(1);
		expect(consoleLogSpy).toHaveBeenCalledWith(colors.yellow.bold(`block:block_1 is not alive`));
	});
});

it(`updateCachedData`, async () => {
	const cache = {
		...NotionCache.createDefaultCache(),
		block: new Map([ [ 'block_1', { id: 'block_1', alive: false } ] ])
	} as any;

	const block = new NotionData({
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

	const block = new NotionData({
		...default_nishan_arg,
		cache,
		type: 'block'
	});

	(block as any).deleteCachedData();
	expect(cache.block.get('block_1')).toBeUndefined();
});

it(`addToChildArray`, async () => {
	const cache = {
			...NotionCache.createDefaultCache(),
			block: new Map([
				[ 'block_1', { id: 'block_1', type: 'header' } ],
				[ 'block_2', { id: 'block_2', type: 'page' } ]
			])
		} as any,
		executeOperationsMock = jest.spyOn(NotionOperations, 'executeOperations').mockImplementation(async () => undefined);

	const block = new NotionData({
		...default_nishan_arg,
		cache,
		type: 'block'
	});

	await (block as any).addToChildArray('block', { id: 'block_2', type: 'page' }, 0);
	expect(executeOperationsMock.mock.calls[0][0]).toStrictEqual([
		o.b.la('block_2', [ 'content' ], { after: '', id: 'block_1' })
	]);
});

it(`updateCacheLocally`, async () => {
	const cache = {
			...NotionCache.createDefaultCache(),
			block: new Map([ [ 'block_1', { id: 'block_1', type: 'header' } ] ])
		} as any,
		executeOperationsMock = jest.spyOn(NotionOperations, 'executeOperations').mockImplementation(async () => undefined);

	const logger = jest.fn();

	const block = new NotionData<IHeader>({
		...default_nishan_arg,
		cache,
		type: 'block',
		logger
	});

	block.updateCacheLocally(
		{
			alive: false,
			unknown: false
		} as any,
		[ 'alive' ]
	);

	expect(logger).toHaveBeenCalledTimes(1);
	expect(logger).toHaveBeenCalledWith('UPDATE', 'block', 'block_1');

	expect(cache.block.get('block_1')).toStrictEqual({ id: 'block_1', type: 'header', alive: false });
	expect(executeOperationsMock.mock.calls[0][0]).toStrictEqual([
		o.b.u('block_1', [], {
			alive: false
		})
	]);
});

describe('initializeCacheForThisData', () => {
	it(`type=block`, async () => {
		const cache = {
			...NotionCache.createDefaultCache(),
			block: new Map([ [ 'block_1', { id: 'block_1', type: 'header' } ] ])
		} as any;

		const block = new NotionData<IHeader>({
			...default_nishan_arg,
			cache,
			type: 'block'
		});

		const initializeCacheForSpecificDataMock = jest
			.spyOn(NotionCache, 'initializeCacheForSpecificData')
			.mockImplementation(async () => undefined);

		await block.initializeCacheForThisData();

		expect(initializeCacheForSpecificDataMock).toHaveBeenCalledTimes(1);
		expect(initializeCacheForSpecificDataMock.mock.calls[0].slice(0, 2)).toEqual([ 'block_1', 'block' ]);
	});

	it(`type=notion_user`, async () => {
		const cache = NotionCache.createDefaultCache();

		const block = new NotionData<IHeader>({
			...default_nishan_arg,
			cache,
			type: 'notion_user',
			id: 'notion_user_1'
		});

		const initializeCacheForSpecificDataMock = jest
			.spyOn(NotionCache, 'initializeCacheForSpecificData')
			.mockImplementation(async () => undefined);

		await block.initializeCacheForThisData();

		expect(initializeCacheForSpecificDataMock).not.toHaveBeenCalled();
	});
});

it(`getProps`, () => {
	const cache = {
		...NotionCache.createDefaultCache(),
		block: new Map([ [ 'block_1', { id: 'block_1', type: 'header' } ] ])
	} as any;

	const block = new NotionData<IHeader>({
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

	const block = new NotionData({
		...default_nishan_arg,
		cache,
		type: 'block'
	});

	const initializeCacheForThisDataMock = jest
		.spyOn(NotionData.prototype, 'initializeCacheForThisData')
		.mockImplementationOnce(() => {
			return {} as any;
		});

	const ChildTraverserGetMock = jest.spyOn(ChildTraverser, 'get').mockImplementation(() => {
		return {} as any;
	});

	await (block as any).getIterate();
	expect(initializeCacheForThisDataMock).toHaveBeenCalledTimes(1);
	expect(ChildTraverserGetMock).toHaveBeenCalledTimes(1);
});

it(`updateIterate`, async () => {
	const cache = {
		...NotionCache.createDefaultCache(),
		block: new Map([ [ 'block_1', { id: 'block_1' } ], [ 'block_2', { id: 'block_2' } ] ])
	} as any;

	const block = new NotionData({
		...default_nishan_arg,
		cache,
		type: 'block'
	});

	const initializeCacheForThisDataMock = jest
		.spyOn(NotionData.prototype, 'initializeCacheForThisData')
		.mockImplementationOnce(() => {
			return {} as any;
		});

	const ChildTraverserUpdateMock = jest.spyOn(ChildTraverser, 'update').mockImplementationOnce(() => {
		return {} as any;
	});

	await (block as any).updateIterate();
	expect(initializeCacheForThisDataMock).toHaveBeenCalledTimes(1);
	expect(ChildTraverserUpdateMock).toHaveBeenCalledTimes(1);
});

it(`deleteIterate`, async () => {
	const cache = {
		...NotionCache.createDefaultCache(),
		block: new Map([ [ 'block_1', { id: 'block_1' } ], [ 'block_2', { id: 'block_2' } ] ])
	} as any;

	const block = new NotionData({
		...default_nishan_arg,
		cache,
		type: 'block'
	});

	const initializeCacheForThisDataMock = jest
		.spyOn(NotionData.prototype, 'initializeCacheForThisData')
		.mockImplementation(() => {
			return {} as any;
		});

	const ChildTraverserDeleteMock = jest.spyOn(ChildTraverser, 'delete').mockImplementation(() => {
		return {} as any;
	});

	await (block as any).deleteIterate();
	expect(initializeCacheForThisDataMock).toHaveBeenCalledTimes(1);
	expect(ChildTraverserDeleteMock).toHaveBeenCalledTimes(1);
});
