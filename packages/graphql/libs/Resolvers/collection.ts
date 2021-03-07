import { INotionCacheOptions, NotionCache } from '@nishans/cache';
import { ICollection, ICollectionViewPage } from '@nishans/types';
import { NotionUtils } from '@nishans/utils';

export const NotionGraphqlCollectionResolver = {
	name: (parent: ICollection) => NotionUtils.extractInlineBlockContent(parent.name),
	parent: async ({ parent_id }: ICollectionViewPage, _: any, ctx: INotionCacheOptions) =>
		await NotionCache.fetchDataOrReturnCached('block', parent_id, ctx)
};
