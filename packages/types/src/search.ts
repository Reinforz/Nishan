interface ISearchTimeFilter {
	starting?: {
		type: 'date';
		start_dat: string;
	};
	ending?: {
		type: 'date';
		start_dat: string;
	};
}

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
		lastEditedTime: ISearchTimeFilter;
		createdTime: ISearchTimeFilter;
	};
	sort: 'Relevance' | 'LastEditedNewest' | 'LastEditedOldest' | 'CreatedNewest' | 'CreatedOldest';
	source: 'relation_setup_menu' | 'trash' | 'quick_find';
}

export interface SearchCollectionInSpace extends SearchNotionEndpoint {
	type: 'CollectionsInSpace';
}

export interface SearchBlocksInAncestor extends SearchNotionEndpoint {
	type: 'BlocksInAncestor';
	ancestorId: string;
}

export interface SearchBlocksInSpace extends SearchNotionEndpoint {
	type: 'BlocksInSpace';
	source: 'relation_setup_menu' | 'trash';
}

export type TSearchNotionEndpointPayload = SearchCollectionInSpace | SearchBlocksInAncestor | SearchBlocksInSpace;
