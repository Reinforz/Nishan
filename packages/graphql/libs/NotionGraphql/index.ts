import { NotionGraphqlServerResolvers } from './resolvers';
import { server } from './server';
import { NotionGraphqlServerTypedefs } from './typedefs';

export const NotionGraphql = {
	server,
	resolver: NotionGraphqlServerResolvers,
	typedefs: NotionGraphqlServerTypedefs
};
