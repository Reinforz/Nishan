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
	TData,
	TOperationTable,
	TPermissionRole,
	TPlanType,
	Transaction,
	TSchemaUnitType,
	TSearchNotionEndpointPayload,
	TViewAggregationsAggregators,
	TViewType,
	UnsubscribedSubscriptionData,
	ViewAggregations,
	ViewSorts
} from './';
import { TEmbedBlockType } from './block';

interface INotionEndpoint<P, R> {
	payload: P;
	response: R;
}
export interface INotionEndpoints {
	getRecordValues: INotionEndpoint<
		INotionEndpoints['syncRecordValues']['payload'],
		{
			results: TData[];
			recordMapWithRoles: RecordMap;
		}
	>;
	enqueueTask: INotionEndpoint<EnqueueTaskParams, EnqueueTaskResult>;
	checkEmailType: INotionEndpoint<
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
	loginWithEmail: INotionEndpoint<
		{
			email: string;
			password: string;
		},
		{
			isNewSignup: boolean;
			userId: string;
		}
	>;
	getClientExperiments: INotionEndpoint<
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
	setPageNotificationsAsRead: INotionEndpoint<
		{
			navigableBlockId: string;
			spaceId: string;
			timestamp: number;
		},
		Record<string, never>
	>;
	setSpaceNotificationsAsRead: INotionEndpoint<
		{
			spaceId: string;
			timestamp: number;
		},
		Record<string, never>
	>;
	getPageVisits: INotionEndpoint<
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
	getUserSharedPages: INotionEndpoint<
		{
			includeDeleted?: boolean;
		},
		{
			pages: { id: string; spaceId: string }[];
			recordMap: Pick<RecordMap, 'block' | 'collection' | 'space'>;
		}
	>;
	getPublicPageData: INotionEndpoint<
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

	getPublicSpaceData: INotionEndpoint<
		{
			type: 'space-ids';
			spaceIds: string[];
		},
		{
			results: IPublicSpaceData[];
		}
	>;

	getSubscriptionData: INotionEndpoint<
		{
			spaceId: string;
		},
		UnsubscribedSubscriptionData | SubscribedSubscriptionData
	>;

	removeUsersFromSpace: INotionEndpoint<
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

	initializePageTemplate: INotionEndpoint<
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

	loadBlockSubtree: INotionEndpoint<
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

	getSpaces: INotionEndpoint<
		Record<string, never>,
		{
			[k: string]: RecordMap;
		}
	>;

	getGenericEmbedBlockData: INotionEndpoint<
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

	getUploadFileUrl: INotionEndpoint<
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

	setBookmarkMetadata: INotionEndpoint<
		{
			blockId: string;
			url: string;
		},
		Record<string, never>
	>;

	queryCollection: INotionEndpoint<
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
	getGoogleDriveAccounts: INotionEndpoint<
		Record<string, unknown>,
		{
			accounts: {
				accountId: string;
				accountName: string;
				token: Token;
			}[];
		}
	>;
	initializeGoogleDriveBlock: INotionEndpoint<
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

	getBacklinksForBlock: INotionEndpoint<
		{
			blockId: string;
		},
		{
			recordMap: {
				block: BlockData;
			};
		}
	>;

	syncRecordValues: INotionEndpoint<
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

	findUser: INotionEndpoint<
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

	createSpace: INotionEndpoint<
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

	loadUserContent: INotionEndpoint<
		Record<string, unknown>,
		{
			recordMap: Omit<RecordMap, 'collection_view'>;
		}
	>;

	getUserSharePages: INotionEndpoint<
		Record<string, unknown>,
		{
			pages: { id: string; spaceId: string }[];
			recordMap: {
				block: BlockData;
				space: SpaceData;
			};
		}
	>;

	inviteGuestsToSpace: INotionEndpoint<
		{
			blockId: string;
			permissionItems: IPermission[];
			spaceId: string;
		},
		Record<string, unknown>
	>;

	loadPageChunk: INotionEndpoint<
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

	getUserTasks: INotionEndpoint<
		Record<string, unknown>,
		{
			taskIds: string[];
		}
	>;

	saveTransaction: INotionEndpoint<
		{
			requestId: string;
			transactions: Transaction[];
		},
		Record<string, unknown>
	>;

	getJoinableSpaces: INotionEndpoint<
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

	isUserDomainJoinable: INotionEndpoint<
		Record<string, unknown>,
		{
			isJoinable: boolean;
		}
	>;

	isEmailEducation: INotionEndpoint<
		Record<string, unknown>,
		{
			isEligible: boolean;
		}
	>;

	getUserNotifications: INotionEndpoint<
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

	getTasks: INotionEndpoint<
		{
			taskIds: string[];
		},
		Record<string, unknown>
	>;
	recordPageVisit: INotionEndpoint<
		{
			blockId: string;
			timestamp: number;
		},
		INotionEndpoints['getPageVisits']['response']
	>;

	search: INotionEndpoint<
		TSearchNotionEndpointPayload,
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
	deleteBlocks: INotionEndpoint<
		{
			blockIds: string[];
			permanentlyDelete: boolean;
		},
		{ recordMap: Pick<RecordMap, 'block'> }
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
