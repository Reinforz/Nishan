import {
	BlockData,
	EnqueueTaskParams,
	EnqueueTaskResult,
	IDrive,
	INotionUser,
	IPermission,
	IViewFilter,
	MediaFormat,
	RecordMap,
	SpaceData,
	SubscribedSubscriptionData,
	TOperationTable,
	TPermissionRole,
	TPlanType,
	Transaction,
	TSchemaUnitType,
	TViewAggregationsAggregators,
	TViewType,
	UnsubscribedSubscriptionData,
	ViewAggregations,
	ViewSorts
} from './';
import { TEmbedBlockType } from './block';

interface NotionEndpoint<P, R> {
	payload: P;
	response: R;
}
export interface NotionEndpoints {
	enqueueTask: NotionEndpoint<EnqueueTaskParams, EnqueueTaskResult>;
	checkEmailType: NotionEndpoint<
		{
			allowAdminBypass: boolean;
			email: string;
		},
		{
			hasAccount: boolean;
			hasPassword: boolean;
			isGoogleAppsEmail: boolean;
			mustReverify: boolean;
		}
	>;
	loginWithEmail: NotionEndpoint<
		{
			email: string;
			password: string;
		},
		{
			isNewSignup: boolean;
			userId: string;
		}
	>;
	getClientExperiments: NotionEndpoint<
		{
			deviceId: string;
		},
		{
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
	>;
	setPageNotificationsAsRead: NotionEndpoint<
		{
			navigableBlockId: string;
			spaceId: string;
			timestamp: number;
		},
		Record<string, never>
	>;
	setSpaceNotificationsAsRead: NotionEndpoint<
		{
			spaceId: string;
			timestamp: number;
		},
		Record<string, never>
	>;
	getPageVisits: NotionEndpoint<
		{
			blockId: string;
			limit: number;
		},
		{
			recordMap: {
				page_visit: {
					[key: string]: {
						role: TPermissionRole;
						value: IPageVisits;
					};
				};
			};
			pageVisits: IPageVisits[];
		}
	>;
	getUserSharedPages: NotionEndpoint<
		{
			includeDeleted?: boolean;
		},
		{
			pages: { id: string; spaceId: string }[];
			recordMap: Pick<RecordMap, 'block' | 'collection' | 'space'>;
		}
	>;
	getPublicPageData: NotionEndpoint<
		{
			blockId?: string;
			name?: 'page';
			saveParent?: boolean;
			showMoveTo?: boolean;
			type?: 'block-space';
		},
		{
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
	>;

	getPublicSpaceData: NotionEndpoint<
		{
			type: 'space-ids';
			spaceIds: string[];
		},
		{
			results: IPublicSpaceData[];
		}
	>;

	getSubscriptionData: NotionEndpoint<
		{
			spaceId: string;
		},
		UnsubscribedSubscriptionData | SubscribedSubscriptionData
	>;

	removeUsersFromSpace: NotionEndpoint<
		{
			removePagePermissions: boolean;
			revokeUserTokens: boolean;
			spaceId: string;
			userIds: string[];
		},
		{
			recordMap: {
				block: BlockData;
				space: SpaceData;
			};
		}
	>;

	initializePageTemplate: NotionEndpoint<
		{
			recordMap: Record<string, unknown>;
			sourceBlockId: string;
			spaceId: string;
			targetBlockId: string;
		},
		{
			recordMap: {
				block: BlockData;
			};
		}
	>;

	loadBlockSubtree: NotionEndpoint<
		{
			blockId: string;
			shallow: boolean;
		},
		{
			subtreeRecordMap: {
				block: BlockData;
			};
		}
	>;

	getSpaces: NotionEndpoint<
		Record<string, never>,
		{
			[k: string]: RecordMap;
		}
	>;

	getGenericEmbedBlockData: NotionEndpoint<
		{
			pageWidth: number;
			source: string;
			type: TEmbedBlockType;
		},
		{
			format: MediaFormat;
			properties: {
				source: string[][];
			};
			type: TEmbedBlockType;
		}
	>;

	getUploadFileUrl: NotionEndpoint<
		{
			bucket: 'secure';
			contentType: string;
			name: string;
		},
		{
			signedGetUrl: string;
			signedPutUrl: string;
			url: string;
		}
	>;

	setBookmarkMetadata: NotionEndpoint<
		{
			blockId: string;
			url: string;
		},
		Record<string, never>
	>;

	queryCollection: NotionEndpoint<
		{
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
		},
		{
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
	>;
	getGoogleDriveAccounts: NotionEndpoint<
		Record<string, unknown>,
		{
			accounts: {
				accountId: string;
				accountName: string;
				token: Token;
			}[];
		}
	>;
	initializeGoogleDriveBlock: NotionEndpoint<
		{
			blockId: string;
			fileId: string;
			token: Token;
		},
		{
			file: GoogleDriveFile;
			recordMap: {
				block: {
					[key: string]: IDrive;
				};
			};
		}
	>;

	getBacklinksForBlock: NotionEndpoint<
		{
			blockId: string;
		},
		{
			recordMap: {
				block: BlockData;
			};
		}
	>;

	syncRecordValues: NotionEndpoint<
		{
			requests: {
				id: string;
				table: TOperationTable;
				version: number;
			}[];
		},
		{
			recordMap: RecordMap;
		}
	>;

	findUser: NotionEndpoint<
		{
			email: string;
		},
		{
			value?: {
				role: TPermissionRole;
				value: INotionUser;
			};
		}
	>;

	createSpace: NotionEndpoint<
		{
			icon: string;
			initialUseCases: string[];
			name: string;
			planType: 'personal';
		},
		{
			recordMap: {
				space: SpaceData;
			};
			spaceId: string;
		}
	>;

	loadUserContent: NotionEndpoint<
		Record<string, unknown>,
		{
			recordMap: Omit<RecordMap, 'collection_view'>;
		}
	>;

	getUserSharePages: NotionEndpoint<
		Record<string, unknown>,
		{
			pages: { id: string; spaceId: string }[];
			recordMap: {
				block: BlockData;
				space: SpaceData;
			};
		}
	>;

	inviteGuestsToSpace: NotionEndpoint<
		{
			blockId: string;
			permissionItems: IPermission[];
			spaceId: string;
		},
		Record<string, unknown>
	>;

	loadPageChunk: NotionEndpoint<
		{
			chunkNumber: number;
			cursor: Cursor;
			limit: number;
			pageId: string;
			verticalColumns: boolean;
		},
		{
			cursor: Cursor;
			recordMap: RecordMap;
		}
	>;

	getUserTasks: NotionEndpoint<
		Record<string, unknown>,
		{
			taskIds: string[];
		}
	>;

	saveTransaction: NotionEndpoint<
		{
			requestId: string;
			transactions: Transaction[];
		},
		Record<string, unknown>
	>;

	getJoinableSpaces: NotionEndpoint<
		Record<string, unknown>,
		{
			results: {
				id: string;
				name: string;
				canJoinSpace: boolean;
				guestPageIds: string[];
			}[];
		}
	>;

	isUserDomainJoinable: NotionEndpoint<
		Record<string, unknown>,
		{
			isJoinable: boolean;
		}
	>;

	isEmailEducation: NotionEndpoint<
		Record<string, unknown>,
		{
			isEligible: boolean;
		}
	>;

	getUserNotifications: NotionEndpoint<
		{
			size: number;
		},
		{
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
	>;

	getTasks: NotionEndpoint<
		{
			taskIds: string[];
		},
		Record<string, unknown>
	>;
	recordPageVisit: NotionEndpoint<
		{
			blockId: string;
			timestamp: number;
		},
		NotionEndpoints['getPageVisits']['response']
	>;

	search: NotionEndpoint<
		{
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
		},
		{
			recordMap: Pick<RecordMap, 'block' | 'collection' | 'space'>;
			results: {
				id: string;
				isNavigable: boolean;
				score: number;
			}[];
			total: number;
		}
	>;
}

export interface Cursor {
	stack: Stack[][];
}

export interface Stack {
	id: string;
	index: number;
	table: 'block';
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

export interface IPageVisits {
	id: string;
	version: number;
	parent_table: 'block';
	parent_id: string;
	user_id: string;
	visited_at: number;
}

export interface IPublicSpaceData {
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

export interface IMember {
	userId: string;
	role: TPermissionRole;
	guestPageIds: string[];
}

export interface Token {
	id: string;
	accessToken: string;
}
