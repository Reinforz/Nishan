require('dotenv').config({ path: '../../.env' });
import { NotionQueries, NotionRequestConfigs } from '@nishans/endpoints';
import { IPage, ISpace, TDataType, TPage } from '@nishans/types';
import { ApolloServer, gql } from 'apollo-server';

// The GraphQL schema
const typeDefs = gql`
  
  union TPage = Page | CollectionViewPage

	type Space {
		id: String!
		name: String!
		pages: [TPage!]
	}

	type PageProperties {
		title: [[String]]
	}

  type CollectionViewPage {
    id: String!
  }

	type Page {
		properties: PageProperties!
		id: String!
		type: String!
		parent: Space!
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
	Query: {
    space: async (_: any, args: { id: string }, ctx: NotionRequestConfigs) =>
      await fetchNotionData(args.id, 'space', ctx),
		page: async (_: any, args: { id: string }, ctx: NotionRequestConfigs) =>
      await fetchNotionData(args.id, 'block', ctx)
	},
	Page: {
		parent: async ({ parent_id }: IPage, _: any, ctx: NotionRequestConfigs) => 
      await fetchNotionData(parent_id, 'space', ctx)
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
		}
	},
  TPage: {
    __resolveType: (obj: TPage) => {
      if(obj.type === "page") return "Page";
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
