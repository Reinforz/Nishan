import { ApolloServer } from 'apollo-server';
import { NotionGraphqlServerResolvers } from "./resolvers";
import { NotionGraphqlServerTypedefs } from "./typedefs";

export const server = new ApolloServer({
	typeDefs: NotionGraphqlServerTypedefs,
	resolvers: NotionGraphqlServerResolvers,
	context: async () => ({
		token: process.env.NISHAN_NOTION_TOKEN_V2,
		user_id: process.env.NISHAN_NOTION_USER_ID,
		interval: process.env.NISHAN_NOTION_REQUEST_INTERVAL ?? 0,
	})
});