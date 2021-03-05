import { NotionQueries, NotionRequestConfigs } from '@nishans/endpoints';
import { IPage, ISpace } from '@nishans/types';
import { notionUserResolvers } from './utils';

export const spaceResolver = {
	pages: async ({ pages: page_ids }: ISpace, _: any, ctx: NotionRequestConfigs) => {
		const { recordMap } = await NotionQueries.syncRecordValues(
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
	...notionUserResolvers
};
