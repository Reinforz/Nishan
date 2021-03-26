import { NotionConstants } from '@nishans/constants';
import { v4 } from 'uuid';
import { createBlockClass } from '../libs';
import { default_nishan_arg } from './utils';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('createBlockClass', () => {
	NotionConstants.blockTypes().forEach((block_type) => {
		it(`Should create Block Class for ${block_type}`, () => {
			expect(createBlockClass(block_type, v4(), default_nishan_arg).id).toBe('123');
		});
	});

	it(`Should throw for unsupported block type`, () => {
		expect(() => createBlockClass('collection_view_pag' as any, v4(), default_nishan_arg)).toThrow();
	});
});
