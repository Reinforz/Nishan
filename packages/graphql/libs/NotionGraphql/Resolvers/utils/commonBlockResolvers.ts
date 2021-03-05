import { NotionRequestConfigs } from '@nishans/endpoints';
import { TCollectionBlock } from '@nishans/types';
import { fetchNotionData } from '../../../';
import { notionUserResolvers } from './notionUserResolvers';

export const commonBlockResolvers = {
	parent: async ({ parent_id, parent_table }: TCollectionBlock, _: any, ctx: NotionRequestConfigs) =>
		await fetchNotionData(parent_id, parent_table, ctx),
	space: async ({ space_id }: TCollectionBlock, _: any, ctx: NotionRequestConfigs) =>
		await fetchNotionData(space_id, 'space', ctx),
	...notionUserResolvers
};
