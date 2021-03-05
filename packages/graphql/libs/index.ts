import { NotionQueries, NotionRequestConfigs } from '@nishans/endpoints';
import { ICollectionView, ICollectionViewPage, IPage, ISpace } from '@nishans/types';
import { ApolloServer } from 'apollo-server';
import { GraphQLJSONObject } from 'graphql-type-json';
import { collectionBlockResolvers } from './collectionBlockResolvers';
import { fetchNotionData } from './fetchNotionData';
import { getBlockResolveType } from './getBlockResolveType';
import { NotionGraphqlServerTypedefs } from "./typedefs";

// A map of functions which return data for the schema.
const resolvers = {
  JSONObject: GraphQLJSONObject,
	Query: {
    space: async (_: any, args: { id: string }, ctx: NotionRequestConfigs) =>
      await fetchNotionData(args.id, 'space', ctx),
		page: async (_: any, args: { id: string }, ctx: NotionRequestConfigs) =>
      await fetchNotionData(args.id, 'block', ctx),
    block: async (_: any, args: { id: string }, ctx: NotionRequestConfigs) =>
      await fetchNotionData(args.id, 'block', ctx)
	},
	Page: {
		parent: async ({ parent_id, parent_table }: IPage, _: any, ctx: NotionRequestConfigs) => 
      await fetchNotionData(parent_id, parent_table, ctx),
    properties: (parent: any) => ({
        title: parent.properties.title[0][0]
    }),
    space: async ({space_id}: IPage, _: any, ctx: NotionRequestConfigs) =>
      await fetchNotionData(space_id, 'space', ctx),
    last_edited_by: async ({last_edited_by_id}: IPage, _: any, ctx: NotionRequestConfigs) =>
      await fetchNotionData(last_edited_by_id, 'notion_user', ctx),
    created_by: async ({created_by_id}: IPage, _: any, ctx: NotionRequestConfigs) =>
      await fetchNotionData(created_by_id, 'notion_user', ctx)
	},
  Collection: {
    name: (parent: any) => parent.name[0][0],
    parent: async ({ parent_id }: ICollectionViewPage, _: any, ctx: NotionRequestConfigs) => 
      await fetchNotionData(parent_id, 'block', ctx),
  },
  CollectionView: collectionBlockResolvers<ICollectionView>(),
  CollectionViewPage: collectionBlockResolvers<ICollectionViewPage>(),
	Space: {
		pages: async ({ pages: page_ids }: ISpace, _: any, ctx: NotionRequestConfigs) => {
			const { recordMap } = await NotionQueries.syncRecordValues(
				{
					requests: page_ids.map((page_id) => ({
						id: page_id,
						table: 'block',
						version: 0
					})) as any
				},
				{
					interval: ctx.interval,
					token: ctx.token,
					user_id: ctx.user_id
				}
			);

			const pages: IPage[] = [];
			for (const page_id in recordMap.block) {
				pages.push(recordMap.block[page_id].value as IPage);
			}
			return pages;
		},
    last_edited_by: async ({last_edited_by_id}: IPage, _: any, ctx: NotionRequestConfigs) =>
      await fetchNotionData(last_edited_by_id, 'notion_user', ctx),
    created_by: async ({created_by_id}: IPage, _: any, ctx: NotionRequestConfigs) =>
      await fetchNotionData(created_by_id, 'notion_user', ctx)
	},
  TPage: {
    __resolveType: getBlockResolveType
  },
  TParent: {
    __resolveType: (obj: ISpace | IPage) => {
      if((obj as IPage).type === "page") return "Page";
      else return "Space";
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

const NotionGraphqlServer = new ApolloServer({
	typeDefs: NotionGraphqlServerTypedefs,
	resolvers,
	context: async () => ({
		token: process.env.NISHAN_NOTION_TOKEN_V2,
		user_id: process.env.NISHAN_NOTION_USER_ID,
		interval: process.env.NISHAN_NOTION_REQUEST_INTERVAL ?? 0,
	})
});

export * from "./collectionBlockResolvers";
export * from "./fetchNotionData";
export * from "./getBlockResolveType";
export default NotionGraphqlServer;
