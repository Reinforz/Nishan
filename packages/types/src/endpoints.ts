import { TViewAggregationsAggregators, ViewAggregations } from './aggregator';
import { BlockData, SpaceData, RecordMap, INotionUser } from './recordMap';
import { TGenericEmbedBlockType, MediaFormat, IDrive } from './block';
import { IViewFilter } from './filter';
import { TPermissionRole, IPermission } from './permissions';
import { TPlanType, GoogleDriveFile, TOperationTable, Cursor, TViewType, TOperationCommand, TDataType } from './types';
import { ViewSorts } from './view';
import { TCredit } from './credit';
import { TSchemaUnitType } from './schema';

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
		page_visit: {
			[key: string]: {
				role: TPermissionRole;
				value: IPageVisit;
			};
		};
	};
	pageVisits: IPageVisit[];
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

export interface GetSubscriptionDataResult {
	accountBalance: number;
	availableCredit: number;
	blockUsage: number;
	bots: string[];
	creditEnabled: boolean;
	hasPaidNonzero: boolean;
	isDelinquent: boolean;
	isSubscribed: boolean;
	joinedMemberIds: string[];
	credits: TCredit[];
	members: IMember[];
	spaceUsers: string[];
	timelineViewUsage: number;
	totalCredit: number;
	type: 'unsubscribed_admin';
}

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

export interface Transaction {
	id: string;
	shardId: number;
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
