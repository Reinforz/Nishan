import { NotionQueries, NotionRequestConfigs } from '@nishans/endpoints';
import { IPage, ISpace } from '@nishans/types';
import { fetchNotionData } from '../..';

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
	last_edited_by: async ({ last_edited_by_id }: IPage, _: any, ctx: NotionRequestConfigs) =>
		await fetchNotionData(last_edited_by_id, 'notion_user', ctx),
	created_by: async ({ created_by_id }: IPage, _: any, ctx: NotionRequestConfigs) =>
		await fetchNotionData(created_by_id, 'notion_user', ctx)
};
