import { IOperation } from '@nishans/types';
import { updateChildContainer } from '../../libs';
import { o } from '../utils/operations';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('updateChildContainer', () => {
	it(`keep=true,bookmarked_pages doesn't include id`, () => {
		const stack: IOperation[] = [],
			data = {
				bookmarked_pages: [],
				id: 'space_view_1'
			} as any;

		updateChildContainer<typeof data>(data, true, 'block_1', 'bookmarked_pages', stack, 'space_view');

		expect(stack).toStrictEqual([
			o.sv.la('space_view_1', [ 'bookmarked_pages' ], {
				id: 'block_1'
			})
		]);

		expect(data.bookmarked_pages).toStrictEqual([ 'block_1' ]);
	});

	it(`keep=false,bookmarked_pages include id`, () => {
		const stack: IOperation[] = [],
			data = {
				bookmarked_pages: [ 'block_1' ],
				id: 'space_view_1'
			} as any;

		updateChildContainer<typeof data>(data, false, 'block_1', 'bookmarked_pages', stack, 'space_view');

		expect(stack).toStrictEqual([
			o.sv.lr('space_view_1', [ 'bookmarked_pages' ], {
				id: 'block_1'
			})
		]);

		expect(data.bookmarked_pages).toStrictEqual([]);
	});

	it(`keep=true,bookmarked_pages include id`, () => {
		const stack: IOperation[] = [],
			data = {
				bookmarked_pages: [ 'block_1' ],
				id: 'space_view_1'
			} as any;

		updateChildContainer<typeof data>(data, true, 'block_1', 'bookmarked_pages', stack, 'space_view');

		expect(stack).toStrictEqual([]);

		expect(data.bookmarked_pages).toStrictEqual([ 'block_1' ]);
	});
});
