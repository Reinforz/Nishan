import { NotionConstants } from '@nishans/constants';
import { v4 } from 'uuid';
import { NotionCore } from '../libs';
import { default_nishan_arg } from './utils';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('createBlockClass', () => {
	NotionConstants.blockTypes().forEach((block_type) => {
		it(`Should create Block Class for ${block_type}`, () => {
			expect(NotionCore.createBlockClass(block_type, v4(), default_nishan_arg).id).toBe('block_1');
		});
	});

	it(`Should throw for unsupported block type`, () => {
		expect(() => NotionCore.createBlockClass('collection_view_pag' as any, v4(), default_nishan_arg)).toThrow();
	});
});
