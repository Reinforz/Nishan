import { ICache, NotionCacheObject } from '@nishans/cache';
import { IOperation } from '@nishans/types';
import { CreateData } from '../../../libs';
import { Page } from '../../../src';
import { default_nishan_arg } from '../../utils/defaultNishanArg';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`getCachedParentData`, async () => {
	const space_1 = {
			id: 'space_1'
		},
		cache = {
  		...NotionCacheObject.createDefaultCache(),
			block: new Map([ [ 'block_1', { id: 'block_1', parent_table: 'space', parent_id: 'space_1' } ] ]),
			space: new Map([ [ 'space_1', space_1 ] ]),
		} as any;

	const page = new Page({
    ...default_nishan_arg,
		cache,
	});

	const space = page.getCachedParentData();
	expect(space).toStrictEqual(space_1);
});

it(`createBlocks`, async () => {
	const space_1 = {
			id: 'space_1'
		},
		cache = {
  		...NotionCacheObject.createDefaultCache(),
			block: new Map([ [ 'block_1', { id: 'block_1', parent_table: 'space', parent_id: 'space_1' } ] ]),
			space: new Map([ [ 'space_1', space_1 ] ]),
		} as any;

	const page = new Page({
    ...default_nishan_arg,
		cache,
	});

	const createContentsMock = jest.spyOn(CreateData, 'contents').mockImplementationOnce(() => {
		return {} as any;
	});

	await page.createBlocks([
		{
			type: 'header',
			properties: {
				title: [ [ 'Header' ] ]
			},
			format: {}
		}
	]);

	expect(createContentsMock).toHaveBeenCalledTimes(1);
});

it(`getBlock`, async () => {
	const space_1 = {
			id: 'space_1'
		},
		cache = {
  		...NotionCacheObject.createDefaultCache(),
			block: new Map([
				[ 'block_1', { id: 'block_1', type: 'page', content: [ 'block_2' ] } ],
				[ 'block_2', { id: 'block_2', type: 'header' } ]
			]),
			space: new Map([ [ 'space_1', space_1 ] ]),
		} as any;

	const page = new Page({
    ...default_nishan_arg,
		cache,
	});

	const block_map = await page.getBlock('block_2');
	expect(block_map.header.get('block_2')).not.toBeUndefined();
});

it(`updateBlock`, async () => {
	const space_1 = {
			id: 'space_1'
		},
		cache = {
  		...NotionCacheObject.createDefaultCache(),
			block: new Map([
				[ 'block_1', { id: 'block_1', type: 'page', content: [ 'block_2' ] } ],
				[ 'block_2', { id: 'block_2', type: 'header' } ]
			]),
			space: new Map([ [ 'space_1', space_1 ] ]),
		} as any;

	const page = new Page({
    ...default_nishan_arg,
		cache,
	});

	const block_map = await page.updateBlock([ 'block_2', { alive: false } as any ]);
	expect(block_map.header.get('block_2')?.getCachedData().alive).toBe(false);
});

it(`updateBlock`, async () => {
	const space_1 = {
			id: 'space_1'
		},
		cache = {
  		...NotionCacheObject.createDefaultCache(),
			block: new Map([
				[ 'block_1', { id: 'block_1', type: 'page', content: [ 'block_2' ] } ],
				[ 'block_2', { id: 'block_2', type: 'header' } ]
			]),
			space: new Map([ [ 'space_1', space_1 ] ]),
		} as any;

	const page = new Page({
		cache,
		id: 'block_1',
		interval: 0,
		shard_id: 123,
		space_id: 'space_1',
		stack: [],
		token: 'token',
		user_id: 'user_root_1'
	});

	await page.deleteBlock('block_2');
	expect(cache.block.get('block_2')?.alive).toBe(false);
});

it(`updateBookmarkedStatus`, async () => {
	const space_view_1 = { space_id: 'space_1', id: 'space_view_1', bookmarked_pages: [ 'block_1' ] },
		cache: ICache = {
  		...NotionCacheObject.createDefaultCache(),
			block: new Map([
				[ 'block_1', { id: 'block_1', type: 'page', space_id: 'space_1' } as any ],
			]),
			space_view: new Map([ [ 'space_view_2', {id: 'space_view_2', space_id: 'space_2'} ], [ 'space_view_1', space_view_1 as any ] ]),
		},
		stack: IOperation[] = [];

	const logger_spy = jest.fn();

	const page = new Page({
    ...default_nishan_arg,
		cache,
		logger: logger_spy,
		stack,
	});

	await page.updateBookmarkedStatus(false);

	expect(stack.length).toBe(1);
});