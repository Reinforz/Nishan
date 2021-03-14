import { INotionEndpointsOptions } from '@nishans/endpoints';
import { ApolloServer } from 'apollo-server';
import { NotionGraphqlResolvers } from './Resolvers';
import { NotionGraphqlTypedefs } from './typedefs';
import { initializeNishan } from './utils';

export const server = async (options: Required<INotionEndpointsOptions>) => {
	const context = await initializeNishan(options);

	return new ApolloServer({
		typeDefs: NotionGraphqlTypedefs,
		resolvers: NotionGraphqlResolvers,
		context
	});
};
