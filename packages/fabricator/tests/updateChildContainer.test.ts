import { ICache } from '@nishans/cache';
import { IOperation } from '@nishans/types';
import { o } from '../../core/tests/utils';
import { updateChildContainer } from '../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

describe('updateChildContainer', () => {
	it(`keep=true,bookmarked_pages doesn't include id`, async () => {
		const space_view_1 = {
				bookmarked_pages: [],
				id: 'space_view_1'
			} as any,
			cache: ICache = {
				space_view: new Map([ [ 'space_view_1', space_view_1 ] ])
			} as any;
		const stack: IOperation[] = [];

		await updateChildContainer('space_view', 'space_view_1', true, 'block_1', cache, stack, 'token');

		expect(stack).toStrictEqual([
			o.sv.la('space_view_1', [ 'bookmarked_pages' ], {
				id: 'block_1'
			})
		]);

		expect(space_view_1.bookmarked_pages).toStrictEqual([ 'block_1' ]);
	});

	it(`keep=false,bookmarked_pages include id`, async () => {
		const space_view_1 = {
				bookmarked_pages: [ 'block_1' ],
				id: 'space_view_1'
			} as any,
			cache: ICache = {
				space_view: new Map([ [ 'space_view_1', space_view_1 ] ])
			} as any;
		const stack: IOperation[] = [];
		await updateChildContainer('space_view', 'space_view_1', false, 'block_1', cache, stack, 'token');

		expect(stack).toStrictEqual([
			o.sv.lr('space_view_1', [ 'bookmarked_pages' ], {
				id: 'block_1'
			})
		]);

		expect(space_view_1.bookmarked_pages).toStrictEqual([]);
	});

	it(`keep=true,bookmarked_pages include id`, async () => {
		const space_view_1 = {
				bookmarked_pages: [ 'block_1' ],
				id: 'space_view_1'
			} as any,
			cache: ICache = {
				space_view: new Map([ [ 'space_view_1', space_view_1 ] ])
			} as any;
		const stack: IOperation[] = [];

		await updateChildContainer('space_view', 'space_view_1', true, 'block_1', cache, stack, 'token');

		expect(stack).toStrictEqual([]);
	});

	it(`keep=true,container doesn't exist`, async () => {
		const space_view_1 = {
				id: 'space_view_1'
			} as any,
			cache: ICache = {
				space_view: new Map([ [ 'space_view_1', space_view_1 ] ])
			} as any;
		const stack: IOperation[] = [];

		await updateChildContainer('space_view', 'space_view_1', true, 'block_1', cache, stack, 'token');

		expect(stack).toStrictEqual([
			o.sv.la('space_view_1', [ 'bookmarked_pages' ], {
				id: 'block_1'
			})
		]);
		expect(space_view_1.bookmarked_pages).toStrictEqual([ 'block_1' ]);
	});
});
