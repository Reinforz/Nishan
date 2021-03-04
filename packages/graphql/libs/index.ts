require('dotenv').config({ path: '../../.env' });
import { NotionQueries, NotionRequestConfigs } from '@nishans/endpoints';
import { IPage } from '@nishans/types';
import { ApolloServer, gql } from 'apollo-server';

// The GraphQL schema
const typeDefs = gql`
	type Space {
		id: String
		name: String
		# pages: [Page]
	}

	type PageProperties {
		title: [[String]]
	}

	type Page {
		properties: PageProperties
		id: String
		type: String
		parent: Space
	}

	type Query {
		page(id: ID!): Page
	}
`;

// A map of functions which return data for the schema.
const resolvers = {
	Query: {
		page: async (_: any, args: { id: string }, ctx: NotionRequestConfigs) => {
			const { recordMap } = await NotionQueries.syncRecordValues(
				{
					requests: [
						{
							id: args.id,
							table: 'block',
							version: 0
						}
					]
				},
				{
					interval: 0,
					token: ctx.token,
					user_id: ctx.user_id
				}
			);
			return recordMap.block[args.id].value;
		}
	},
	Page: {
		parent: async ({ parent_id }: IPage, _: any, ctx: NotionRequestConfigs) => {
			const { recordMap } = await NotionQueries.syncRecordValues(
				{
					requests: [
						{
							id: parent_id,
							table: 'space',
							version: 0
						}
					]
				},
				{
					interval: 0,
					token: ctx.token,
					user_id: ctx.user_id
				}
			);

			return recordMap.space[parent_id].value;
		}
	}
};

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: async () => ({
		token: process.env.NISHAN_NOTION_TOKEN_V2
	})
});

server.listen().then(({ url }) => {
	console.log(`🚀 Server ready at ${url}`);
});
