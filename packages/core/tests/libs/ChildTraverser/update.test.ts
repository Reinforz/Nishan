import { ICache } from '@nishans/cache';
import { ICollection, IOperation, IPage, TBlock } from '@nishans/types';
import { ChildTraverser } from '../../../libs';
import { o } from '../../utils/operations';
import { c1id, c1uo, c2id, c2uo, c3id, cd, constructCache, p1id, p1uo, uc1d, uc2d, up1d, update_props } from './utils';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`manual=false`, async () => {
	const child_ids = [ c1id, c2id, c3id ],
		stack: IOperation[] = [];
	const cache = constructCache(child_ids);

	const logger_spy = jest.fn(),
		cb_spy = jest.fn();

	const updated_data = await ChildTraverser.update<IPage, TBlock, TBlock>(
		[ [ c1id, { data: c1id } as any ], [ c2id, { data: c2id } as any ] ],
		(id) => cache.block.get(id),
		{
			container: [],
			cache,
			child_ids,
			stack,
			logger: logger_spy,
			...update_props
		},
		(id, data, update_data, container) => {
			cb_spy(id, data, update_data);
			container.push(data);
		}
	);

	expect(logger_spy.mock.calls).toEqual([ [ 'UPDATE', 'block', c1id ], [ 'UPDATE', 'block', c2id ] ]);
	expect(cb_spy.mock.calls).toEqual([
		[
			c1id,
			uc1d,
			{
				data: c1id
			}
		],
		[
			c2id,
			uc2d,
			{
				data: c2id
			}
		]
	]);
	expect(cache.block.get(p1id)).toStrictEqual(up1d);
	expect(updated_data).toStrictEqual([ uc1d, uc2d ]);
	expect(stack).toStrictEqual([ c1uo, c2uo, p1uo ]);
});

it(`manual=false,parent_type&child_type!=block`, async () => {
	const child_ids = [ c1id ],
		stack: IOperation[] = [];
	const cache = {
		collection: new Map([
			[
				p1id,
				{
					id: p1id,
					content: child_ids
				}
			],
			cd(c1id)
		])
	} as ICache;

	await ChildTraverser.update<IPage, ICollection, ICollection>(
		[ [ c1id, { data: c1id } as any ] ],
		(id) => cache.collection.get(id),
		{
			container: [],
			cache,
			child_ids,
			stack,
			...update_props,
			child_type: 'collection',
			parent_type: 'collection'
		}
	);

	expect(cache.collection.get(p1id)).toStrictEqual({
		id: p1id,
		content: child_ids
	});
	expect(stack).toStrictEqual([
		o.c.u(c1id, [], {
			data: c1id
		})
	]);
});

it(`manual=true`, async () => {
	const child_ids = [ c1id, c2id, c3id ],
		stack: IOperation[] = [];
	const cache = constructCache(child_ids);

	const updated_data = await ChildTraverser.update<IPage, TBlock, TBlock>(
		[ [ c1id, { data: c1id } as any ], [ c2id, { data: c2id } as any ] ],
		(id) => cache.block.get(id),
		{
			container: [],
			cache,
			child_ids: 'content',
			stack,
			manual: true,
			...update_props
		},
		(_, data, __, container) => {
			data.alive = false;
			container.push(data);
		}
	);

	expect(cache.block.get(p1id)).toStrictEqual(up1d);

	expect(updated_data).toStrictEqual([
		{
			id: c1id,
			alive: false
		},
		{
			id: c2id,
			alive: false
		}
	]);

	expect(stack).toStrictEqual([ p1uo ]);
});
