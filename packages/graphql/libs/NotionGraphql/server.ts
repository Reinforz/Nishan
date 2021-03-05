import { Nishan } from '@nishans/core';
import { NotionRequestConfigs } from '@nishans/endpoints';
import { ApolloServer } from 'apollo-server';
import { NotionGraphqlServerResolvers } from './Resolvers';
import { NotionGraphqlServerTypedefs } from './typedefs';

export const server = async ({ token, interval, user_id }: Required<NotionRequestConfigs>) => {
	const nishan = new Nishan({
		token,
		interval
	});

	const notion_user = await nishan.getNotionUser(user_id);

	return new ApolloServer({
		typeDefs: NotionGraphqlServerTypedefs,
		resolvers: NotionGraphqlServerResolvers,
		context: () => notion_user.getProps()
	});
};
