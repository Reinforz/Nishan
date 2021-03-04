interface SearchNotionEndpoint {
	query: string;
	spaceId: string;
	limit: number;
	filters: {
		isDeletedOnly: boolean;
		excludeTemplates: boolean;
		isNavigableOnly: boolean;
		requireEditPermissions: boolean;
		ancestors: string[];
		createdBy: string[];
		editedBy: string[];
		lastEditedTime: Record<string, never>;
		createdTime: Record<string, never>;
	};
	sort: 'Relevance';
	source: 'relation_setup_menu' | 'trash';
}

export interface SearchCollectionInSpace extends SearchNotionEndpoint {
	type: 'CollectionsInSpace';
}

export interface SearchBlocksInAncestor extends SearchNotionEndpoint {
	type: 'BlocksInAncestor';
	ancestorId: string;
}

export type SearchBlocksInSpace = {
	type: 'BlocksInSpace';
	source: 'relation_setup_menu' | 'trash';
};

export type TSearchNotionEndpointPayload = SearchCollectionInSpace | SearchBlocksInAncestor | SearchBlocksInSpace;
