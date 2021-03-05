import { NotionRequestConfigs } from '@nishans/endpoints';
import { TCollectionBlock } from '@nishans/types';
import { fetchNotionData } from '../../fetchNotionData';
import { commonBlockResolvers } from './utils';

export const collectionBlockResolver = {
	collection: async ({ collection_id }: TCollectionBlock, _: any, ctx: NotionRequestConfigs) =>
		await fetchNotionData(collection_id, 'collection', ctx),
	...commonBlockResolvers
};
