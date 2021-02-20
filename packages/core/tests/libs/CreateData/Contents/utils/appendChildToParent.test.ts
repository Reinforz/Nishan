import { ICache } from '@nishans/cache';
import { IOperation } from '@nishans/types';
import { appendChildToParent } from '../../../../../libs/CreateData/Contents/utils';

describe('appendChildToParent', () => {
	describe(`type=block`, () => {
		it(`path exists`, async () => {
			const stack: IOperation[] = [],
				cache: ICache = {
					block: new Map([ [ 'parent_id', { content: [] } ] ])
				} as any;
			await appendChildToParent('block', 'parent_id', 'child_id', cache, stack, 'token');

			expect(stack).toStrictEqual([
				{
					table: 'block',
					command: 'listAfter',
					id: 'parent_id',
					args: {
						after: '',
						id: 'child_id'
					},
					path: [ 'content' ]
				}
			]);

			expect(cache.block.get('parent_id')).toStrictEqual({ content: [ 'child_id' ] });
		});

		it(`path doesnt exists`, async () => {
			const stack: IOperation[] = [],
				cache: ICache = {
					block: new Map([ [ 'parent_id', {} ] ])
				} as any;
			await appendChildToParent('block', 'parent_id', 'child_id', cache, stack, 'token');

			expect(stack).toStrictEqual([
				{
					table: 'block',
					command: 'listAfter',
					id: 'parent_id',
					args: {
						after: '',
						id: 'child_id'
					},
					path: [ 'content' ]
				}
			]);

			expect(cache.block.get('parent_id')).toStrictEqual({ content: [ 'child_id' ] });
		});
	});

	describe(`type=space`, () => {
		it(`path exists`, async () => {
			const stack: IOperation[] = [],
				cache: ICache = {
					space: new Map([ [ 'parent_id', { pages: [] } ] ])
				} as any;
			await appendChildToParent('space', 'parent_id', 'child_id', cache, stack, 'token');

			expect(stack).toStrictEqual([
				{
					table: 'space',
					command: 'listAfter',
					id: 'parent_id',
					args: {
						after: '',
						id: 'child_id'
					},
					path: [ 'pages' ]
				}
			]);

			expect(cache.space.get('parent_id')).toStrictEqual({ pages: [ 'child_id' ] });
		});

		it(`path doesnt exists`, async () => {
			const stack: IOperation[] = [],
				cache: ICache = {
					space: new Map([ [ 'parent_id', {} ] ])
				} as any;
			await appendChildToParent('space', 'parent_id', 'child_id', cache, stack, 'token');

			expect(stack).toStrictEqual([
				{
					table: 'space',
					command: 'listAfter',
					id: 'parent_id',
					args: {
						after: '',
						id: 'child_id'
					},
					path: [ 'pages' ]
				}
			]);

			expect(cache.space.get('parent_id')).toStrictEqual({ pages: [ 'child_id' ] });
		});
	});

	describe(`type=collection`, () => {
		it(`path exists`, async () => {
			const stack: IOperation[] = [],
				cache: ICache = {
					collection: new Map([ [ 'parent_id', { template_pages: [] } ] ])
				} as any;
			await appendChildToParent('collection', 'parent_id', 'child_id', cache, stack, 'token');

			expect(stack).toStrictEqual([
				{
					table: 'collection',
					command: 'listAfter',
					id: 'parent_id',
					args: {
						after: '',
						id: 'child_id'
					},
					path: [ 'template_pages' ]
				}
			]);

			expect(cache.collection.get('parent_id')).toStrictEqual({ template_pages: [ 'child_id' ] });
		});

		it(`path doesnt exists`, async () => {
			const stack: IOperation[] = [],
				cache: ICache = {
					collection: new Map([ [ 'parent_id', {} ] ])
				} as any;
			await appendChildToParent('collection', 'parent_id', 'child_id', cache, stack, 'token');

			expect(stack).toStrictEqual([
				{
					table: 'collection',
					command: 'listAfter',
					id: 'parent_id',
					args: {
						after: '',
						id: 'child_id'
					},
					path: [ 'template_pages' ]
				}
			]);

			expect(cache.collection.get('parent_id')).toStrictEqual({ template_pages: [ 'child_id' ] });
		});
	});
});
