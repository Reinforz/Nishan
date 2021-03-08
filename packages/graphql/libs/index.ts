export * from './getBlockResolveType';
export * from './types';

import { NotionGraphqlResolvers } from './Resolvers';
import { server } from './server';
import { NotionGraphqlTypedefs } from './typedefs';

export const NotionGraphql = {
	server,
	Resolvers: NotionGraphqlResolvers,
	typedefs: NotionGraphqlTypedefs
};
