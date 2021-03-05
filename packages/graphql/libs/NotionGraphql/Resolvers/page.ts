import { NotionRequestConfigs } from '@nishans/endpoints';
import { IPage } from '@nishans/types';
import { fetchNotionData } from '../..';

export const pageResolver = {
	parent: async ({ parent_id, parent_table }: IPage, _: any, ctx: NotionRequestConfigs) =>
		await fetchNotionData(parent_id, parent_table, ctx),
	properties: (parent: any) => ({
		title: parent.properties.title[0][0]
	}),
	space: async ({ space_id }: IPage, _: any, ctx: NotionRequestConfigs) =>
		await fetchNotionData(space_id, 'space', ctx),
	last_edited_by: async ({ last_edited_by_id }: IPage, _: any, ctx: NotionRequestConfigs) =>
		await fetchNotionData(last_edited_by_id, 'notion_user', ctx),
	created_by: async ({ created_by_id }: IPage, _: any, ctx: NotionRequestConfigs) =>
		await fetchNotionData(created_by_id, 'notion_user', ctx)
};
