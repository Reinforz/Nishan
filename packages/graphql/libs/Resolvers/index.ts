import { INotionCacheOptions, NotionCache } from '@nishans/cache';
import { IPage, ISpace } from '@nishans/types';
import { GraphQLJSONObject } from 'graphql-type-json';
import { getBlockResolveType } from '../';
import { NotionGraphqlCollectionResolver } from './collection';
import { NotionGraphqlCollectionBlockResolver } from './collectionBlock';
import { NotionGraphqlPageResolver } from './page';
import { NotionGraphqlSpaceResolver } from './space';

export const NotionGraphqlResolvers = {
	JSONObject: GraphQLJSONObject,
	Query: {
		space: async (_: any, args: { id: string }, ctx: INotionCacheOptions) =>
			await NotionCache.fetchDataOrReturnCached('space', args.id, ctx),
		page: async (_: any, args: { id: string }, ctx: INotionCacheOptions) =>
			await NotionCache.fetchDataOrReturnCached('block', args.id, ctx),
		block: async (_: any, args: { id: string }, ctx: INotionCacheOptions) =>
			await NotionCache.fetchDataOrReturnCached('block', args.id, ctx)
	},
	Page: NotionGraphqlPageResolver,
	Collection: NotionGraphqlCollectionResolver,
	CollectionView: NotionGraphqlCollectionBlockResolver,
	CollectionViewPage: NotionGraphqlCollectionBlockResolver,
	Space: NotionGraphqlSpaceResolver,
	TPage: {
		__resolveType: getBlockResolveType
	},
	TParent: {
		__resolveType: (obj: ISpace | IPage) => {
			if ((obj as IPage).type === 'page') return 'Page';
			else return 'Space';
		}
	},
	TCollectionBlock: {
		__resolveType: getBlockResolveType
	},
	TBlock: {
		__resolveType: getBlockResolveType
	},
	Block: {
		__resolveType: getBlockResolveType
	}
};
