export * from './types';

import { NotionEndpointsRequest } from './Request';
import { NotionEndpointsMutations } from './Mutations';
import { NotionEndpointsQueries } from './Queries';

export const NotionEndpoints = {
	Request: NotionEndpointsRequest,
	Mutations: NotionEndpointsMutations,
	Queries: NotionEndpointsQueries
};
