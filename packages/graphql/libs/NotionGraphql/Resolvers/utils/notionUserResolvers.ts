import { NotionRequestConfigs } from '@nishans/endpoints';
import { IPage } from '@nishans/types';
import { fetchNotionData } from '../../../';

export const notionUserResolvers = {
	last_edited_by: async ({ last_edited_by_id }: IPage, _: any, ctx: NotionRequestConfigs) =>
		await fetchNotionData(last_edited_by_id, 'notion_user', ctx),
	created_by: async ({ created_by_id }: IPage, _: any, ctx: NotionRequestConfigs) =>
		await fetchNotionData(created_by_id, 'notion_user', ctx)
};
