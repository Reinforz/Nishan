import { INotionCacheOptions } from '@nishans/cache';
import { NotionEndpoints } from '@nishans/endpoints';
import { IPage, ISpace } from '@nishans/types';
import { NotionGraphqlNotionUserResolvers } from './utils';

export const NotionGraphqlSpaceResolver = {
	pages: async ({ pages: page_ids }: ISpace, _: any, ctx: INotionCacheOptions) => {
		const { recordMap } = await NotionEndpoints.Queries.syncRecordValues(
			{
				requests: page_ids.map((page_id) => ({
					id: page_id,
					table: 'block',
					version: 0
				})) as any
			},
			{
				interval: ctx.interval,
				token: ctx.token,
				user_id: ctx.user_id
			}
		);

		const pages: IPage[] = [];
		for (const page_id in recordMap.block) {
			pages.push(recordMap.block[page_id].value as IPage);
		}
		return pages;
	},
	...NotionGraphqlNotionUserResolvers
};
