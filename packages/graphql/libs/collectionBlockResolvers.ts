import { NotionRequestConfigs } from '@nishans/endpoints';
import { IPage, TCollectionBlock } from '@nishans/types';
import { fetchNotionData } from './fetchNotionData';

export function collectionBlockResolvers<T extends TCollectionBlock> () {
	return {
		collection: async ({ collection_id }: T, _: any, ctx: NotionRequestConfigs) =>
			await fetchNotionData(collection_id, 'collection', ctx),
		parent: async ({ parent_id, parent_table }: T, _: any, ctx: NotionRequestConfigs) =>
			await fetchNotionData(parent_id, parent_table, ctx),
		space: async ({ space_id }: T, _: any, ctx: NotionRequestConfigs) => await fetchNotionData(space_id, 'space', ctx),
		last_edited_by: async ({ last_edited_by_id }: IPage, _: any, ctx: NotionRequestConfigs) =>
			await fetchNotionData(last_edited_by_id, 'notion_user', ctx),
		created_by: async ({ created_by_id }: IPage, _: any, ctx: NotionRequestConfigs) =>
			await fetchNotionData(created_by_id, 'notion_user', ctx)
	};
}
