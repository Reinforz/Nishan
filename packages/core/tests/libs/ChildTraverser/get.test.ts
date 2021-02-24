import { ICache } from '@nishans/cache';
import { ISpace, TBlock, TPage } from '@nishans/types';
import { ChildTraverser } from '../../../libs';
import { cc } from './utils';

afterEach(() => {
	jest.restoreAllMocks();
});

const child_ids = [ 'child_one_id', 'child_two_id', 'child_three_id' ];

[ child_ids, 'content' ].forEach((prop_child_id) => {
	it('child_ids=array', async () => {
		const cache: ICache = {
			block: new Map([
				[
					'parent_one_id',
					{
						id: 'parent_one_id',
						content: child_ids
					}
				],
				cc('child_one_id'),
				cc('child_two_id')
			])
		} as any;

		const logger = jest.fn(),
			cb_spy = jest.fn();
		const container = await ChildTraverser.get<ISpace, TPage, TBlock[]>(
			child_ids,
			(id) => cache.block.get(id) as TPage,
			{
				parent_id: 'parent_one_id',
				parent_type: 'block',
				child_type: 'block',
				child_ids: prop_child_id as any,
				container: [],
				cache,
				logger
			},
			(id, data, container) => {
				cb_spy(id, data);
				container.push(data);
			}
		);

		expect(cb_spy.mock.calls).toEqual([ cc('child_one_id'), cc('child_two_id') ]);
		expect(logger.mock.calls).toEqual([ [ 'READ', 'block', 'child_one_id' ], [ 'READ', 'block', 'child_two_id' ] ]);
		expect(container).toStrictEqual([
			{
				id: 'child_one_id'
			},
			{
				id: 'child_two_id'
			}
		]);
	});
});
