import { GraphQLJSONObject } from 'graphql-type-json';
import { NotionGraphqlCollectionResolver } from './collection';
import { NotionGraphqlCollectionBlockResolver } from './collection_block';
import { NotionGraphqlPageResolver } from './page';
import { NotionGraphqlQueryResolvers } from './query';
import { NotionGraphqlSpaceResolver } from './space';
import { getBlockResolveType, getParentResolveType } from './utils';

export const NotionGraphqlResolvers = {
	JSONObject: GraphQLJSONObject,
	Query: NotionGraphqlQueryResolvers,
	Page: NotionGraphqlPageResolver,
	Collection: NotionGraphqlCollectionResolver,
	CollectionView: NotionGraphqlCollectionBlockResolver,
	CollectionViewPage: NotionGraphqlCollectionBlockResolver,
	Space: NotionGraphqlSpaceResolver,
	TPage: {
		__resolveType: getBlockResolveType
	},
	TParent: {
		__resolveType: getParentResolveType
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
