import {
	BlockData,
	IDrive,
	INotionUser,
	IPermission,
	IViewFilter,
	MediaFormat,
	RecordMap,
	SpaceData,
	SubscribedSubscriptionData,
	TDataType,
	TGenericEmbedBlockType,
	TPermissionRole,
	TPlanType,
	TSchemaUnitType,
	TViewAggregationsAggregators,
	TViewType,
	UnsubscribedSubscriptionData,
	ViewAggregations,
	ViewSorts
} from './';

export interface CheckEmailTypeParams {
	allowAdminBypass: boolean;
	email: string;
}

export interface CheckEmailTypeResult {
	hasAccount: boolean;
	hasPassword: boolean;
	isGoogleAppsEmail: boolean;
	mustReverify: boolean;
}

export interface PingParams {}

export interface LoginWithEmailParams {
	email: string;
	password: string;
}

export interface LoginWithEmailResult {
	isNewSignup: boolean;
	userId: string;
}

export interface GetClientExperimentsParams {
	deviceId: string;
}

export interface GetClientExperimentsResult {
	deviceId: string;
	isLoaded: boolean;
	test: boolean;
	userId: string;
	experiments: {
		experimentId: string;
		experimentVersion: number;
		group?: string;
	}[];
}

export interface GoogleDriveFileUser {
	displayName: string;
	emailAddress: string;
	kind: 'drive#user';
	me: boolean;
	permissionId: string;
	photoLink: string;
}

export interface GoogleDriveFile {
	iconLink: string;
	id: string;
	lastModifyingUser: GoogleDriveFileUser;
	mimeType: string;
	modifiedTime: string;
	name: string;
	thumbnailVersion: '0';
	trashed: boolean;
	webViewLink: string;
}

export interface SetPageNotificationsAsReadParams {
	navigableBlockId: string;
	spaceId: string;
	timestamp: number;
}

export interface SetSpaceNotificationsAsReadParams {
	spaceId: string;
	timestamp: number;
}

export interface GetPageVisitsParams {
	blockId: string;
	limit: number;
}

export interface GetPageVisitsResult {
	recordMap: {
		page_visit: IPageVisitData;
	};
	pageVisits: IPageVisit[];
}

export interface IPageVisitData {
	[key: string]: {
		role: TPermissionRole;
		value: IPageVisit;
	};
}

export interface IPageVisit {
	id: string;
	version: number;
	parent_table: 'block';
	parent_id: string;
	user_id: string;
	visited_at: number;
}

export interface GetUserSharedPagesParams {
	includeDeleted?: boolean;
}

export interface GetUserSharedPagesResult {
	pages: { id: string; spaceId: string }[];
	recordMap: Pick<RecordMap, 'block' | 'collection' | 'space'>;
}

export interface GetPublicPageDataParams {
	blockId?: string;
	name?: 'page';
	saveParent?: boolean;
	showMoveTo?: boolean;
	type?: 'block-space';
}

export interface GetPublicPageDataResult {
	betaEnabled: boolean;
	canJoinSpace: boolean;
	canRequestAccess: boolean;
	hasPublicAccess: boolean;
	icon: string;
	ownerUserId: string;
	spaceId: string;
	spaceName: string;
	userHasExplicitAccess: boolean;
}

export interface GetPublicSpaceDataParams {
	type: 'space-ids';
	spaceIds: string[];
}

export interface GetPublicSpaceDataResult {
	results: SpaceDataResult[];
}

export interface SpaceDataResult {
	createdTime: number;
	disableExport: boolean;
	disableGuests: boolean;
	disableMoveToSpace: boolean;
	disablePublicAccess: boolean;
	icon: string;
	id: string;
	inviteLinkEnabled: boolean;
	memberCount: number;
	name: string;
	planType: TPlanType;
	shardId: number;
}

export interface GetSubscriptionDataParams {
	spaceId: string;
}

export interface IMember {
	userId: string;
	role: TPermissionRole;
	guestPageIds: string[];
}

export type GetSubscriptionDataResult = UnsubscribedSubscriptionData | SubscribedSubscriptionData;

export interface RemoveUsersFromSpaceParams {
	removePagePermissions: boolean;
	revokeUserTokens: boolean;
	spaceId: string;
	userIds: string[];
}

export interface RemoveUsersFromSpaceResult {
	recordMap: {
		block: BlockData;
		space: SpaceData;
	};
}

export interface InitializePageTemplateParams {
	recordMap: Record<string, unknown>;
	sourceBlockId: string;
	spaceId: string;
	targetBlockId: string;
}

export interface InitializePageTemplateResult {
	recordMap: {
		block: BlockData;
	};
}

export interface LoadBlockSubtreeParams {
	blockId: string;
	shallow: boolean;
}

export interface LoadBlockSubtreeResult {
	subtreeRecordMap: {
		block: BlockData;
	};
}

export interface GetSpacesResult {
	[k: string]: RecordMap;
}

export interface GetGenericEmbedBlockDataParams {
	pageWidth: number;
	source: string;
	type: TGenericEmbedBlockType;
}

export interface GetGenericEmbedBlockDataResult {
	format: MediaFormat;
	properties: {
		source: string[][];
	};
	type: TGenericEmbedBlockType;
}

export interface GetUploadFileUrlParams {
	bucket: 'secure';
	contentType: string;
	name: string;
}

export interface GetUploadFileUrlResult {
	signedGetUrl: string;
	signedPutUrl: string;
	url: string;
}

export interface SetBookmarkMetadataParams {
	blockId: string;
	url: string;
}

export interface QueryCollectionParams {
	collectionId: string;
	collectionViewId: string;
	query: {
		filter?: IViewFilter;
		sort?: ViewSorts[];
		aggregations?: ViewAggregations[];
		aggregate?: {
			aggregation_type: TViewAggregationsAggregators;
			id: string;
			property: string;
			type: TSchemaUnitType;
			view_type: TViewType;
		}[];
	};
	loader: {
		limit?: number;
		searchQuery?: string;
		type: 'table';
		loadContentCover: boolean;
		userTimeZone?: string;
	};
}

export interface Token {
	id: string;
	accessToken: string;
}

export interface Account {
	accountId: string;
	accountName: string;
	token: Token;
}

export interface GetGoogleDriveAccountsResult {
	accounts: Account[];
}

export interface InitializeGoogleDriveBlockParams {
	blockId: string;
	fileId: string;
	token: Token;
}

export interface InitializeGoogleDriveBlockResult {
	file: GoogleDriveFile;
	recordMap: {
		block: {
			[key: string]: IDrive;
		};
	};
}

export interface GetBackLinksForBlockParams {
	blockId: string;
}

export interface SyncRecordValues {
	id: string;
	table: TOperationTable;
	version: number;
}
export interface SyncRecordValuesParams {
	requests: SyncRecordValues[];
}

export interface InviteGuestsToSpaceParams {
	blockId: string;
	permissionItems: IPermission[];
	spaceId: string;
}

export interface FindUserParams {
	email: string;
}

export interface FindUserResult {
	value?: {
		role: TPermissionRole;
		value: INotionUser;
	};
}

export interface CreateSpaceParams {
	icon: string;
	initialUseCases: string[];
	name: string;
	planType: 'personal';
}

export interface CreateSpaceResult {
	recordMap: {
		space: SpaceData;
	};
	spaceId: string;
}

export interface QueryCollectionResult {
	result: {
		aggregationResults: {
			type: 'number';
			value: number;
		}[];
		blockIds: string[];
		total: number;
		type: 'table';
	};
	recordMap: Pick<RecordMap, 'collection' | 'space' | 'collection_view' | 'block'>;
}

export interface LoadUserContentResult {
	recordMap: Omit<RecordMap, 'collection_view'>;
}

export interface GetUserSharePagesResult {
	pages: { id: string; spaceId: string }[];
	recordMap: {
		block: BlockData;
		space: SpaceData;
	};
}
export interface SyncRecordValuesResult {
	recordMap: RecordMap;
}

export interface Cursor {
	stack: Stack[][];
}

export interface Stack {
	id: string;
	index: number;
	table: 'block';
}

export interface LoadPageChunkParams {
	chunkNumber: number;
	cursor: Cursor;
	limit: number;
	pageId: string;
	verticalColumns: boolean;
}

export interface LoadPageChunkResult {
	cursor: Cursor;
	recordMap: RecordMap;
}

export interface GetBackLinksForBlockResult {
	recordMap: {
		block: BlockData;
	};
}

export interface GetUserTasksResult {
	taskIds: string[];
}

export type TOperationCommand =
	| 'set'
	| 'update'
	| 'keyedObjectListAfter'
	| 'keyedObjectListUpdate'
	| 'listAfter'
	| 'listRemove'
	| 'listBefore'
	| 'setPermissionItem';
export type TOperationTable =
	| 'space'
	| 'collection_view'
	| 'collection'
	| 'collection_view_page'
	| 'page'
	| 'block'
	| 'space_view'
	| 'notion_user'
	| 'user_settings'
	| 'user_root';

export interface Transaction {
	id: string;
	shardId?: number;
	spaceId: string;
	operations: IOperation[];
}

export interface IOperation {
	table: TDataType;
	id: string;
	command: TOperationCommand;
	path: string[];
	args: any;
}

export interface SaveTransactionParams {
	requestId: string;
	transactions: Transaction[];
}

export interface GetJoinableSpacesResult {
	results: {
		id: string;
		name: string;
		canJoinSpace: boolean;
		guestPageIds: string[];
	}[];
}

export interface IsUserDomainJoinableResult {
	isJoinable: boolean;
}

export interface IsEmailEducationResult {
	isEligible: boolean;
}

export interface GetUserNotificationsParams {
	size: number;
}

export interface GetUserNotificationsResult {
	recordMap: Record<string, unknown>;
	results: {
		spaceId: string;
		unread: {
			mentions: number;
			following: number;
			nonMentions: number;
		};
		unreceived: {
			notificationIds: string[];
		};
	}[];
}

export interface GetTasksParams {
	taskIds: string[];
}

export interface RecordPageVisitParams {
	blockId: string;
	timestamp: number;
}

export type RecordPageVisitResult = GetPageVisitsResult;

export type SearchParams = {
	type: 'CollectionsInSpace';
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
	source: 'relation_setup_menu';
};

export type SearchResult = {
	recordMap: Pick<RecordMap, 'block' | 'collection' | 'space'>;
	results: {
		id: string;
		isNavigable: boolean;
		score: number;
	}[];
	total: number;
};
