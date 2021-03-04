require('dotenv').config({ path: '../../.env' });
import { NotionQueries, NotionRequestConfigs } from '@nishans/endpoints';
import { ICollectionView, ICollectionViewPage, IPage, ISpace, TCollectionBlock, TDataType, TPage } from '@nishans/types';
import { ApolloServer, gql } from 'apollo-server';
import { GraphQLJSONObject } from 'graphql-type-json';

// The GraphQL schema
const typeDefs = gql`
  
  scalar JSONObject
  
  union TParent = Page | Space
  union TPage = Page | CollectionViewPage
  union TCollectionBlock = CollectionViewPage | CollectionView

  interface Block{
    type: String!
    id: String!
    parent: TParent!
    space: Space!
    last_edited_by: NotionUser!
    created_by: NotionUser!
  }

  type NotionUser {
    email: String!
    family_name: String!
    given_name: String!
    id: String!
    onboarding_completed: Boolean!
    profile_photo: String!
    version: Int!
  }

	type Space {
		id: String!
		name: String!
		pages: [TPage!]
    last_edited_by: NotionUser!
    created_by: NotionUser!
	}

  type CollectionViewPage implements Block {
    id: String!
    collection: Collection!
		parent: TParent!
    type: String!
    space: Space!
    last_edited_by: NotionUser!
    created_by: NotionUser!
  }

  type CollectionView implements Block {
    id: String!
    type: String!
    collection: Collection!
		parent: TParent!
    space: Space!
    last_edited_by: NotionUser!
    created_by: NotionUser!
  }

  type PageProperties {
		title: String!
	}

	type Page implements Block {
		properties: PageProperties!
		id: String!
		type: String!
		parent: TParent!
    space: Space!
    last_edited_by: NotionUser!
    created_by: NotionUser!
	}

  type Collection {
    id: String!
    name: String!
    schema: JSONObject!
    parent: TCollectionBlock!
  }

	type Query {
		page(id: ID!): Page
		space(id: ID!): Space
	}
`;

async function fetchNotionData(id: string, table: TDataType, request_configs: NotionRequestConfigs){
  const { recordMap } = await NotionQueries.syncRecordValues(
    {
      requests: [
        {
          id,
          table: table,
          version: 0
        }
      ]
    },
    {
      interval: 0,
      ...request_configs
    }
  );
  return recordMap[table][id].value;
}

// A map of functions which return data for the schema.
const resolvers = {
  JSONObject: GraphQLJSONObject,
	Query: {
    space: async (_: any, args: { id: string }, ctx: NotionRequestConfigs) =>
      await fetchNotionData(args.id, 'space', ctx),
		page: async (_: any, args: { id: string }, ctx: NotionRequestConfigs) =>
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
  CollectionView: {
    collection: async ({collection_id}: ICollectionView, _: any, ctx: NotionRequestConfigs) => 
      await fetchNotionData(collection_id, 'collection', ctx),
    parent: async ({ parent_id, parent_table }: ICollectionView, _: any, ctx: NotionRequestConfigs) => 
      await fetchNotionData(parent_id, parent_table, ctx),
    space: async ({space_id}: ICollectionView, _: any, ctx: NotionRequestConfigs) =>
      await fetchNotionData(space_id, 'space', ctx),
    last_edited_by: async ({last_edited_by_id}: IPage, _: any, ctx: NotionRequestConfigs) =>
      await fetchNotionData(last_edited_by_id, 'notion_user', ctx),
    created_by: async ({created_by_id}: IPage, _: any, ctx: NotionRequestConfigs) =>
      await fetchNotionData(created_by_id, 'notion_user', ctx)
  },
  CollectionViewPage: {
    collection: async ({collection_id}: ICollectionViewPage, _: any, ctx: NotionRequestConfigs) => 
      await fetchNotionData(collection_id, 'collection', ctx),
    parent: async ({ parent_id, parent_table }: ICollectionViewPage, _: any, ctx: NotionRequestConfigs) => 
      await fetchNotionData(parent_id, parent_table, ctx),
    space: async ({space_id}: ICollectionViewPage, _: any, ctx: NotionRequestConfigs) =>
      await fetchNotionData(space_id, 'space', ctx),
    last_edited_by: async ({last_edited_by_id}: IPage, _: any, ctx: NotionRequestConfigs) =>
      await fetchNotionData(last_edited_by_id, 'notion_user', ctx),
    created_by: async ({created_by_id}: IPage, _: any, ctx: NotionRequestConfigs) =>
      await fetchNotionData(created_by_id, 'notion_user', ctx)
  },
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
					interval: 0,
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
    __resolveType: (obj: TPage) => {
      if(obj.type === "page") return "Page";
      else if(obj.type === "collection_view_page") return "CollectionViewPage";
    }
  },
  TParent: {
    __resolveType: (obj: ISpace | IPage) => {
      if((obj as IPage).type === "page") return "Page";
      else return "Space";
    }
  },
  TCollectionBlock: {
    __resolveType: (obj: TCollectionBlock) => {
      if(obj.type === "collection_view") return "CollectionView";
      else if(obj.type === "collection_view_page") return "CollectionViewPage";
    }
  }
};

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: async () => ({
		token: process.env.NISHAN_NOTION_TOKEN_V2,
		user_id: process.env.NISHAN_NOTION_USER_ID,
		interval: process.env.NISHAN_NOTION_REQUEST_INTERVAL ?? 0,
	})
});

server.listen().then(({ url }) => {
	console.log(`🚀 Server ready at ${url}`);
});
