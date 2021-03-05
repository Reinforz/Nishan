import { NotionRequestConfigs } from '@nishans/endpoints';
import { ICollectionViewPage, IPage, ISpace } from '@nishans/types';
import { GraphQLJSONObject } from 'graphql-type-json';
import { fetchNotionData, getBlockResolveType } from '../..';
import { collectionBlockResolver } from './collectionBlock';
import { pageResolver } from './page';
import { spaceResolver } from './space';

export const NotionGraphqlServerResolvers = {
	JSONObject: GraphQLJSONObject,
	Query: {
		space: async (_: any, args: { id: string }, ctx: NotionRequestConfigs) =>
			await fetchNotionData(args.id, 'space', ctx),
		page: async (_: any, args: { id: string }, ctx: NotionRequestConfigs) =>
			await fetchNotionData(args.id, 'block', ctx),
		block: async (_: any, args: { id: string }, ctx: NotionRequestConfigs) =>
			await fetchNotionData(args.id, 'block', ctx)
	},
	Page: pageResolver,
	Collection: {
		name: (parent: any) => parent.name[0][0],
		parent: async ({ parent_id }: ICollectionViewPage, _: any, ctx: NotionRequestConfigs) =>
			await fetchNotionData(parent_id, 'block', ctx)
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
