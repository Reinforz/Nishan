export * from './types';

import { NotionEndpointsMutations } from './Mutations';
import { NotionEndpointsQueries } from './Queries';
import { NotionEndpointsRequest } from './Request';

export const NotionEndpoints = {
	Request: NotionEndpointsRequest,
	Mutations: NotionEndpointsMutations,
	Queries: NotionEndpointsQueries
};
