import { Nishan } from '@nishans/core';
import { INotionEndpointsOptions } from '@nishans/endpoints';
import { ApolloServer } from 'apollo-server';
import { NotionGraphqlResolvers } from './Resolvers';
import { NotionGraphqlTypedefs } from './typedefs';
import { cacheInitializerTracker } from './utils';

export const server = async ({ token, interval, user_id }: Required<INotionEndpointsOptions>) => {
	const cache_initializer_tracker = cacheInitializerTracker();
	const nishan = new Nishan({
		token,
		interval
	});

	const notion_user = await nishan.getNotionUser(user_id);

	return new ApolloServer({
		typeDefs: NotionGraphqlTypedefs,
		resolvers: NotionGraphqlResolvers,
		context: () => ({ ...notion_user.getProps(), cache_initializer_tracker })
	});
};
