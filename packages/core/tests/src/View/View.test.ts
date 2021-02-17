import { IOperation } from '@nishans/types';
import { View } from '../../../src';
import { createDefaultCache } from '../../createDefaultCache';
import { default_nishan_arg } from '../../defaultNishanArg';

it('getCollection', () => {
	const collection_1 = {
			schema: {
				title: {
					type: 'title',
					name: 'Title'
				}
			}
		} as any,
		collection_view_1 = { parent_id: 'block_1', id: 'collection_view_1' } as any,
		cache = {
			...createDefaultCache(),
			block: new Map([ [ 'block_1', { collection_id: 'collection_1', id: 'block_1' } ] ]),
			collection: new Map([ [ 'collection_1', collection_1 as any ] ]),
			collection_view: new Map([ [ 'collection_view_1', collection_view_1 ] ])
		} as any,
		stack: IOperation[] = [];

	const view = new View({
		...default_nishan_arg,
		cache,
		id: 'collection_view_1',
		stack
	});

	expect(view.getCollection()).toStrictEqual(collection_1);
});

it('getCachedParentData', () => {
	const collection_view_1 = { parent_id: 'block_1', id: 'collection_view_1' } as any,
		cache = {
			...createDefaultCache(),
			block: new Map([ [ 'block_1', { collection_id: 'collection_1', id: 'block_1' } ] ]),
			collection_view: new Map([ [ 'collection_view_1', collection_view_1 ] ])
		} as any,
		stack: IOperation[] = [];

	const view = new View({
		...default_nishan_arg,
		cache,
		id: 'collection_view_1',
		stack
	});

	expect(view.getCachedParentData()).toStrictEqual({ collection_id: 'collection_1', id: 'block_1' });
});
