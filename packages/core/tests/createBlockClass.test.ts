import { NotionCache } from '@nishans/cache';
import { NotionConstants } from '@nishans/constants';
import { v4 } from 'uuid';
import { createBlockClass, INotionCoreOptions } from '../libs';

const arg: INotionCoreOptions = {
	token: 'token',
	interval: 0,
	user_id: '',
	shard_id: 123,
	space_id: '123',
	cache: NotionCache.createDefaultCache(),
	logger: false,
	id: '123'
};

afterEach(() => {
	jest.restoreAllMocks();
});

describe('createBlockClass', () => {
	NotionConstants.blockTypes().forEach((block_type) => {
		it(`Should create Block Class for ${block_type}`, () => {
			expect(createBlockClass(block_type, v4(), arg).id).toBe('123');
		});
	});

	it(`Should throw for unsupported block type`, () => {
		expect(() => createBlockClass('collection_view_pag' as any, v4(), arg)).toThrow();
	});
});
