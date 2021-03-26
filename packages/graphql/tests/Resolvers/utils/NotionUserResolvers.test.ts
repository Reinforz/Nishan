import { NotionCache } from '@nishans/cache';
import { default_nishan_arg } from '../../../../core/tests/utils';
import { NotionGraphqlNotionUserResolvers } from '../../../libs/Resolvers/utils';

([ `last_edited_by`, 'created_by' ] as (keyof typeof NotionGraphqlNotionUserResolvers)[]).forEach((method) => {
	it(method, async () => {
		const notion_user_1 = { id: 'notion_user_1' },
			block_1: any = { [`${method}_id`]: 'notion_user_1' },
			cache: any = {
				...NotionCache.createDefaultCache(),
				notion_user: new Map([ [ 'notion_user_1', notion_user_1 ] ])
			};
		const data = await NotionGraphqlNotionUserResolvers[method](
			block_1,
			{},
			{
				...default_nishan_arg,
				cache
			}
		);
		expect(data).toStrictEqual(notion_user_1);
	});
});
