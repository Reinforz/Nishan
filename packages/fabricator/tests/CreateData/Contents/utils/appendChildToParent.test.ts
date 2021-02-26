import { ICache } from '@nishans/cache';
import { IOperation } from '@nishans/types';
import { o } from '../../../../../core/tests/utils';
import { appendChildToParent } from '../../../../libs/CreateData/Contents/utils';

it(`path exists`, async () => {
	const stack: IOperation[] = [],
		cache: ICache = {
			block: new Map([ [ 'parent_id', { type: 'page', content: [] } ] ])
		} as any;
	await appendChildToParent('block', 'parent_id', 'child_id', cache, stack, 'token');

	expect(stack).toStrictEqual([
		o.b.la('parent_id', [ 'content' ], {
			after: '',
			id: 'child_id'
		})
	]);
});

it(`path doesn't exists`, async () => {
	const stack: IOperation[] = [],
		cache: ICache = {
			block: new Map([ [ 'parent_id', { type: 'page' } ] ])
		} as any;
	await appendChildToParent('block', 'parent_id', 'child_id', cache, stack, 'token');

	expect(stack).toStrictEqual([
		o.b.la('parent_id', [ 'content' ], {
			after: '',
			id: 'child_id'
		})
	]);
});
