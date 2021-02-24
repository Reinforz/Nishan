import { ISpace, TBlock, TPage } from '@nishans/types';
import { ChildTraverser } from '../../../libs';
import { c1id, c2id, cd, constructCache, d } from './utils';

afterEach(() => {
	jest.restoreAllMocks();
});

const child_ids = [ c1id, c2id ];

it('child_ids=array', async () => {
	const cache = constructCache(child_ids);

	const logger = jest.fn(),
		cb_spy = jest.fn();
	const container = await ChildTraverser.get<ISpace, TPage, TBlock[]>(
		child_ids,
		(id) => cache.block.get(id) as TPage,
		{
			parent_id: 'parent_one_id',
			parent_type: 'block',
			child_type: 'block',
			child_ids,
			container: [],
			cache,
			logger
		},
		(id, data, container) => {
			cb_spy(id, data);
			container.push(data);
		}
	);

	expect(cb_spy.mock.calls).toEqual([ cd(c1id), cd(c2id) ]);
	expect(logger.mock.calls).toEqual([ [ 'READ', 'block', c1id ], [ 'READ', 'block', c2id ] ]);
	expect(container).toStrictEqual([ d(c1id), d(c2id) ]);
});
