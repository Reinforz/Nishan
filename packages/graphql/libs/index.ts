export * from './getBlockResolveType';

import { NotionGraphqlServerResolvers } from './Resolvers';
import { server } from './server';
import { NotionGraphqlServerTypedefs } from './typedefs';

export const NotionGraphql = {
	server,
	Resolvers: NotionGraphqlServerResolvers,
	typedefs: NotionGraphqlServerTypedefs
};
