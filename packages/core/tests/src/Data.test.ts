import { NotionCacheObject } from '@nishans/cache';
import { IHeader, IOperation } from '@nishans/types';
import colors from 'colors';
import { ChildTraverser } from '../../libs';
import { NotionData } from '../../src';
import { o } from '../utils';
import { default_nishan_arg } from '../utils/defaultNishanArg';
import { last_edited_props } from '../utils/lastEditedProps';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`getLastEditedProps`, async () => {
	const cache = {
		...NotionCacheObject.createDefaultCache(),
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
		...NotionCacheObject.createDefaultCache(),
		block: new Map([ [ 'block_1', { id: 'block_1' } ], [ 'block_2', { id: 'block_2' } ] ])
	} as any;

	const block = new NotionData({
		...default_nishan_arg,
		cache,
		type: 'block'
	});

	(block as any).updateLastEditedProps();
	expect(cache.block.get('block_1')).toStrictEqual({
		id: 'block_1',
		...last_edited_props
	});

	(block as any).updateLastEditedProps(cache.block.get('block_2'));
	expect(cache.block.get('block_2')).toStrictEqual({
		id: 'block_2',
		...last_edited_props
	});
});

describe('getCachedData', () => {
	it(`data exists`, async () => {
		const cache = {
			...NotionCacheObject.createDefaultCache(),
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

	it(`data doesnt exists`, async () => {
		const cache = {
			...NotionCacheObject.createDefaultCache(),
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
			...NotionCacheObject.createDefaultCache(),
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
		...NotionCacheObject.createDefaultCache(),
		block: new Map([ [ 'block_1', { id: 'block_1', alive: false } ] ])
	} as any;

	const block = new NotionData({
		...default_nishan_arg,
		cache,
		type: 'block'
	});

	const updateCacheManuallyMock = jest.spyOn(NotionData.prototype, 'updateCacheManually').mockImplementationOnce(() => {
		return {} as any;
	});
	await block.updateCachedData();
	expect(updateCacheManuallyMock).toHaveBeenCalledTimes(1);
	expect(updateCacheManuallyMock).toHaveBeenCalledWith([ [ 'block_1', 'block' ] ]);
});

it(`deleteCachedData`, async () => {
	const cache = {
		...NotionCacheObject.createDefaultCache(),
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
			...NotionCacheObject.createDefaultCache(),
			block: new Map([
				[ 'block_1', { id: 'block_1', type: 'header' } ],
				[ 'block_2', { id: 'block_2', type: 'page' } ]
			])
		} as any,
		stack: IOperation[] = [];

	const block = new NotionData({
		...default_nishan_arg,
		cache,
		type: 'block',
		stack
	});

	(block as any).addToChildArray('block', { id: 'block_2', type: 'page' }, 0);
	expect(stack.length).toBe(1);
});

it(`updateCacheLocally`, async () => {
	const cache = {
			...NotionCacheObject.createDefaultCache(),
			block: new Map([ [ 'block_1', { id: 'block_1', type: 'header' } ] ])
		} as any,
		stack: IOperation[] = [];

	const logger = jest.fn();

	const block = new NotionData<IHeader>({
		...default_nishan_arg,
		cache,
		type: 'block',
		stack,
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
	expect(stack).toStrictEqual([
		o.b.u('block_1', [], {
			alive: false
		})
	]);
});

it(`initializeCacheForThisData`, async () => {
	const cache = {
			...NotionCacheObject.createDefaultCache(),
			block: new Map([ [ 'block_1', { id: 'block_1', type: 'header' } ] ])
		} as any,
		stack: IOperation[] = [];

	const block = new NotionData<IHeader>({
		...default_nishan_arg,
		cache,
		type: 'block',
		stack
	});
	const initializeCacheForSpecificDataMock = jest
		.spyOn(NotionData.prototype, 'initializeCacheForSpecificData')
		.mockImplementation(() => {
			return {} as any;
		});

	await block.initializeCacheForThisData();

	expect(initializeCacheForSpecificDataMock).toHaveBeenCalledTimes(1);
	expect(initializeCacheForSpecificDataMock).toHaveBeenCalledWith('block_1', 'block');

	await block.initializeCacheForThisData();
});

it(`getProps`, () => {
	const cache = {
			...NotionCacheObject.createDefaultCache(),
			block: new Map([ [ 'block_1', { id: 'block_1', type: 'header' } ] ])
		} as any,
		stack: IOperation[] = [];

	const block = new NotionData<IHeader>({
		...default_nishan_arg,
		cache,
		type: 'block',
		stack
	});

	const props = block.getProps();
	expect(props.token).toBe('token');
	expect(props.interval).toBe(0);
	expect(props.user_id).toBe('user_root_1');
	expect(props.shard_id).toBe(123);
	expect(props.space_id).toBe('space_1');
});

it(`getIterate`, async () => {
	const cache = {
		...NotionCacheObject.createDefaultCache(),
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

	const ChildTraverserGetMock = jest.spyOn(ChildTraverser, 'get').mockImplementationOnce(() => {
		return {} as any;
	});

	await (block as any).getIterate();
	expect(initializeCacheForThisDataMock).toHaveBeenCalledTimes(1);
	expect(ChildTraverserGetMock).toHaveBeenCalledTimes(1);
});

it(`updateIterate`, async () => {
	const cache = {
		...NotionCacheObject.createDefaultCache(),
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
		...NotionCacheObject.createDefaultCache(),
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
