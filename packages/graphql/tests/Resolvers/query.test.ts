import { NotionCache } from '@nishans/cache';
import { default_nishan_arg } from '../../../core/tests/utils';
import { NotionGraphqlQueryResolvers } from '../../libs/Resolvers/query';

it(`space`, async () => {
	const space_1: any = { id: 'space_1' },
		cache: any = {
			...NotionCache.createDefaultCache(),
			space: new Map([ [ 'space_1', space_1 ] ])
		};
	const data = await NotionGraphqlQueryResolvers.space(
		undefined,
		{ id: 'space_1' },
		{
			...default_nishan_arg,
			cache
		}
	);
	expect(data).toStrictEqual(space_1);
});

[ 'page', 'block' ].forEach((method) => {
	it(method, async () => {
		const block_1: any = { id: 'block_1' },
			cache: any = {
				...NotionCache.createDefaultCache(),
				block: new Map([ [ 'block_1', block_1 ] ])
			};
		const data = await (NotionGraphqlQueryResolvers as any)[method](
			undefined,
			{ id: 'block_1' },
			{
				cache,
				token: 'token',
				user_id: 'notion_user_1',
				interval: 0
			}
		);
		expect(data).toStrictEqual(block_1);
	});
});
