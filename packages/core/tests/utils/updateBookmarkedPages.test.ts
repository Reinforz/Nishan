import { IOperation } from '@nishans/types';
import { updateBookmarkedPages } from '../../utils';

describe('updateBookmarkedPages', () => {
	it(`updated_favourite_status=true,bookmarked_pages ! include id`, () => {
		const stack: IOperation[] = [],
			data = {
				bookmarked_pages: [],
				id: 'space_view_1'
			} as any;

		updateBookmarkedPages(data, true, 'block_1', stack);

		expect(stack).toStrictEqual([
			{
				path: [ 'bookmarked_pages' ],
				table: 'space_view',
				command: 'listAfter',
				args: { id: 'block_1' },
				id: 'space_view_1'
			}
		]);

		expect(data.bookmarked_pages).toStrictEqual([ 'block_1' ]);
	});

	it(`updated_favourite_status=false,bookmarked_pages include id`, () => {
		const stack: IOperation[] = [],
			data = {
				bookmarked_pages: [ 'block_1' ],
				id: 'space_view_1'
			} as any;

		updateBookmarkedPages(data, false, 'block_1', stack);

		expect(stack).toStrictEqual([
			{
				path: [ 'bookmarked_pages' ],
				table: 'space_view',
				command: 'listRemove',
				args: { id: 'block_1' },
				id: 'space_view_1'
			}
		]);

		expect(data.bookmarked_pages).toStrictEqual([]);
	});

	it(`updated_favourite_status=true,bookmarked_pages include id`, () => {
		const stack: IOperation[] = [],
			data = {
				bookmarked_pages: [ 'block_1' ],
				id: 'space_view_1'
			} as any;

		updateBookmarkedPages(data, true, 'block_1', stack);

		expect(stack).toStrictEqual([]);

		expect(data.bookmarked_pages).toStrictEqual([ 'block_1' ]);
	});
});
