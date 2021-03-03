import { NotionCacheObject } from '@nishans/cache';
import { TBlockType } from '@nishans/types';
import { v4 } from 'uuid';
import { createBlockClass, NishanArg } from '../libs';

const arg: NishanArg = {
	token: 'token',
	interval: 0,
	user_id: '',
	shard_id: 123,
	space_id: '123',
	cache: NotionCacheObject.createDefaultCache(),
	logger: false,
	stack: [],
	id: '123'
};

afterEach(() => {
	jest.restoreAllMocks();
});

describe('createBlockClass', () => {
	([
		'video',
		'audio',
		'image',
		'bookmark',
		'code',
		'file',
		'tweet',
		'gist',
		'codepen',
		'maps',
		'figma',
		'drive',
		'text',
		'table_of_contents',
		'equation',
		'breadcrumb',
		'factory',
		'to_do',
		'header',
		'sub_header',
		'sub_sub_header',
		'bulleted_list',
		'numbered_list',
		'toggle',
		'quote',
		'divider',
		'callout',
		'column',
		'column_list',
		'embed'
	] as TBlockType[]).forEach((block_type) => {
		it(`Should create Block Class`, () => {
			expect(createBlockClass(block_type, v4(), arg).id).toBe('123');
		});
	});

	it(`Should create Page class`, () => {
		expect(createBlockClass('page', v4(), arg).id).toBe('123');
	});

	it(`Should create CollectionView class`, () => {
		expect(createBlockClass('collection_view', v4(), arg).id).toBe('123');
	});

	it(`Should create CollectionView class`, () => {
		expect(createBlockClass('linked_db', v4(), arg).id).toBe('123');
	});

	it(`Should create CollectionViewPage class`, () => {
		expect(createBlockClass('collection_view_page', v4(), arg).id).toBe('123');
	});

	it(`Should throw for unsupported block type`, () => {
		expect(() => createBlockClass('collection_view_pag' as any, v4(), arg)).toThrow();
	});
});
