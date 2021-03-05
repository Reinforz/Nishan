import { ICache, NotionCache } from '@nishans/cache';
import { NotionOperationOptions } from '@nishans/operations';
import { ICollectionViewPage, IPage, ISpace } from '@nishans/types';
import { NotionUtils } from '@nishans/utils';
import { GraphQLJSONObject } from 'graphql-type-json';
import { getBlockResolveType } from '../..';
import { collectionBlockResolver } from './collectionBlock';
import { pageResolver } from './page';
import { spaceResolver } from './space';

export const NotionGraphqlServerResolvers = {
	JSONObject: GraphQLJSONObject,
	Query: {
		space: async (_: any, args: { id: string }, ctx: NotionOperationOptions & { cache: ICache }) =>
			await NotionCache.fetchDataOrReturnCached('space', args.id, ctx, ctx.cache),
		page: async (_: any, args: { id: string }, ctx: NotionOperationOptions & { cache: ICache }) =>
			await NotionCache.fetchDataOrReturnCached('block', args.id, ctx, ctx.cache),
		block: async (_: any, args: { id: string }, ctx: NotionOperationOptions & { cache: ICache }) =>
			await NotionCache.fetchDataOrReturnCached('block', args.id, ctx, ctx.cache)
	},
	Page: pageResolver,
	Collection: {
		name: (parent: any) => NotionUtils.extractInlineBlockContent(parent.name[0][0]),
		parent: async ({ parent_id }: ICollectionViewPage, _: any, ctx: NotionOperationOptions & { cache: ICache }) =>
			await NotionCache.fetchDataOrReturnCached('block', parent_id, ctx, ctx.cache)
	},
	CollectionView: collectionBlockResolver,
	CollectionViewPage: collectionBlockResolver,
	Space: spaceResolver,
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
