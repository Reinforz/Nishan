import {
	EnqueueTaskPayload,
	EnqueueTaskResponse,
	GetTasksResponse,
	IActivityData,
	IDrive,
	INotificationData,
	INotionUser,
	IPageVisitsData,
	IPermission,
	IViewFilter,
	MediaFormat,
	NotionApiUserRateLimitResponseError,
	NotionApiUserValidationIncorrectPasswordError,
	NotionApiUserValidationInvalidOrExpiredPasswordError,
	NotionApiUserValidationUserWithEmailExistsError,
	RecordMap,
	SubscribedSubscriptionData,
	TData,
	TDataType,
	TEmbedBlockType,
	TNotificationChannel,
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
import { ICommentData, IDiscussionData, IFollowData, IPageVisits, ISlackIntegration } from './recordMap';

interface INotionEndpoint<P, R> {
	payload: P;
	response: R;
}
export interface INotionEndpoints {
	restoreBlock: INotionEndpoint<
		{
			pointer: {
				id: string;
				spaceId: string;
				table: 'block';
			};
		},
		{ recordMap: Pick<RecordMap, 'block'> }
	>;
	authWithSlack: INotionEndpoint<
		{
			code: string;
			encryptedState: string;
		},
		Record<string, unknown>
	>;
	getSignedFileUrls: INotionEndpoint<
		{
			urls: {
				url: string;
				permissionRecord: {
					table: TDataType;
					id: string;
				};
			}[];
		},
		{
			signedUrls: string[];
		}
	>;
	getSnapshotsList: INotionEndpoint<
		{
			blockId: string;
			size: number;
		},
		{
			snapshots: {
				author_ids: null | string[];
				authors: { id: string; table: 'notion_user' }[];
				collection_ids: null | string[];
				id: string;
				inline_collection_block_ids: null | string[];
				last_version: number;
				parent_id: string;
				parent_table: 'collection' | 'block';
				shard_id: number;
				space_id: string;
				timestamp: string;
				version: number;
			}[];
		}
	>;
	getSnapshotContents: INotionEndpoint<
		{
			blockId: string;
			timestamp: string;
		},
		{
			contentMap: Pick<RecordMap, 'block' | 'collection' | 'collection_view' | 'space'>;
			recordMap: Pick<RecordMap, 'notion_user'>;
		}
	>;
	setPassword:
		| INotionEndpoint<{ newPassword: string }, { action: 'Set' }>
		| INotionEndpoint<
				{
					clearPassword: boolean;
					oldPassword: string;
				},
				{ action: 'Remove' } | NotionApiUserValidationIncorrectPasswordError
			>
		| INotionEndpoint<
				{
					newPassword: string;
					oldPassword: string;
				},
				{ action: 'Change' } | NotionApiUserValidationIncorrectPasswordError
			>;
	getNotificationLog: INotionEndpoint<
		{
			size: number;
			spaceId: string;
			type?: TNotificationChannel;
		},
		{
			notificationIds: string[];
			recordMap: Partial<
				Pick<RecordMap, 'user_root' | 'space' | 'notion_user' | 'block' | 'comment' | 'discussion'> & {
					activity: IActivityData;
					notifications: INotificationData;
				}
			>;
		}
	>;
	logoutActiveSessions: INotionEndpoint<Record<string, unknown>, Record<string, unknown>>;
	deleteUser: INotionEndpoint<Record<string, unknown>, Record<string, unknown>>;
	changeEmail: INotionEndpoint<
		{
			currentEmailPasscode: string;
			newEmail: string;
			newEmailPasscode: string;
			type: 'CurrentEmail';
		},
		NotionApiUserValidationInvalidOrExpiredPasswordError | Record<string, unknown>
	>;
	sendEmailVerification: INotionEndpoint<
		{
			email: string;
		},
		NotionApiUserValidationUserWithEmailExistsError | Record<string, unknown>
	>;
	sendTemporaryPassword: INotionEndpoint<
		{
			disableLoginLink: boolean;
			email: string;
			isSignup: boolean;
		},
		{ csrfState: string } | NotionApiUserRateLimitResponseError
	>;
	setDataAccessConsent: INotionEndpoint<
		{ expiryTime?: number },
		{
			expiryTime?: number;
			userId: string;
		}
	>;
	getDataAccessConsent: INotionEndpoint<Record<string, unknown>, { userId: string }>;
	disconnectDrive: INotionEndpoint<{ googleUserId: string }, Record<string, unknown>>;
	getConnectedAppsStatus: INotionEndpoint<
		Record<string, unknown>,
		{
			drive: {
				accountId: string;
				accountName: string;
			}[];
		}
	>;
	getTrelloBoards: INotionEndpoint<Record<string, unknown>, { boards: string[] }>;
	getEvernoteNotebooks: INotionEndpoint<
		Record<string, unknown>,
		{
			notebooks: {
				guid: string;
				isDefault: boolean;
				noteCount: number;
				title: string;
			}[];
			userInfo: {
				email: null | string;
				name: string;
				photoUrl: null | string;
				username: string;
			};
		}
	>;
	getAsanaWorkspaces: INotionEndpoint<
		Record<string, unknown>,
		{
			projects: Record<string, unknown>;
			workspaces: [];
		}
	>;
	getInvoiceData: INotionEndpoint<
		{
			invoiceId: string;
			type: 'invoice';
		},
		{
			spaceId: string;
			status: 'not_paid';
			date: number;
			customer: {
				email: string;
				name: string;
				businessName: string;
				addressLine1: string;
				addressLine2: string;
				zipCode: string;
				city: string;
				state: string;
				country: string;
				vatId: string;
			};
			items: {
				productId: string;
				start: number;
				end: number;
				quantity: number;
				proration: boolean;
				planAmount: number;
				planInterval: 'year' | 'month';
				amount: number;
			}[];
			total: number;
			startingBalance: number;
			amountRemaining: number;
			amountPaid: number;
			endingBalance: number;
		}
	>;
	updateSubscription: INotionEndpoint<
		{
			addressCity?: string;
			addressCountry?: string;
			addressLine1?: string;
			addressLine2?: string;
			addressState?: string;
			addressZip?: string;
			businessName?: string;
			customerName?: string;
			billingEmail?: string;
			vatId?: string;
			spaceId: string;
		},
		Record<string, any>
	>;
	getBillingHistory: INotionEndpoint<
		{
			limit: number;
			spaceId: string;
		},
		{
			events: {
				amount: number;
				attempted: boolean;
				id: string;
				status: 'open';
				timestamp: number;
				total: number;
				type: 'invoice';
				url: string;
			}[];
			reachedEndOfResults: boolean;
		}
	>;
	getBots: INotionEndpoint<
		{
			id: string;
			table: 'space';
			type: string;
		},
		{
			botIds: string[];
			recordMap: Record<string, unknown>;
		}
	>;
	getSamlConfigForSpace: INotionEndpoint<{ spaceId: string }, Record<string, unknown>>;
	getAvailableCountries: INotionEndpoint<Record<string, unknown>, { countries: { name: string }[] }>;
	getUserAnalyticsSettings: INotionEndpoint<
		{
			platform: 'web' | 'desktop' | 'mobile';
		},
		{
			intercomAppId: string;
			intercomUserHash: string;
			isIntercomEnabled: boolean;
			isLoaded: boolean;
			isSegmentEnabled: boolean;
			noIntercomUserId: boolean;
			user_email: string;
			user_id: string;
		}
	>;
	logout: INotionEndpoint<Record<string, never>, Record<string, never>>;
	loginWithGoogleAuth: INotionEndpoint<
		{
			code: string;
			encryptedToken: string;
		},
		{
			isNewSignup: boolean;
			userId: string;
		}
	>;
	getAssetsJsonV2: INotionEndpoint<
		{ hash: string },
		{
			entry: string;
			files: {
				hash: string;
				path: string;
				size: number;
			}[];
			hash: string;
			headersWhitelist: string[];
			localeHtml: {
				'en-US': string;
				'es-ES': string;
				'fr-FR': string;
				'ja-JP': string;
				'ko-KR': string;
				'pt-BR': string;
				'zh-CN': string;
				'zh-TW': string;
			};
			proxyServerPathPrefixes: string[];
			version: string;
		}
	>;
	getUserSharedPagesInSpace: INotionEndpoint<
		{
			includeDeleted: boolean;
			spaceId: string;
		},
		{
			pages: string[];
			recordMap: Pick<RecordMap, 'block' | 'collection' | 'space'>;
		}
	>;
	getRecordValues: INotionEndpoint<
		INotionEndpoints['syncRecordValues']['payload'],
		{
			results: TData[];
			recordMapWithRoles: RecordMap;
		}
	>;
	enqueueTask: INotionEndpoint<EnqueueTaskPayload, EnqueueTaskResponse>;
	checkEmailType: INotionEndpoint<
		{
			allowAdminBypass: boolean;
			email: string;
		},
		{
			hasAccount: boolean;
			hasPassword?: boolean;
			isGoogleAppsEmail: boolean;
			mustReverify?: boolean;
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
				page_visit: IPageVisitsData;
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
	getActivityLog: INotionEndpoint<
		{
			limit: number;
			navigableBlockId?: string;
			spaceId: string;
		},
		{
			activityIds: string[];
			recordMap: Pick<RecordMap, 'block' | 'collection' | 'notion_user' | 'space'> & {
				activity: IActivityData;
				follow: IFollowData;
				discussion: IDiscussionData;
				comment: ICommentData;
				slack_integration: {
					[k: string]: {
						role: TPermissionRole;
						value?: ISlackIntegration;
					};
				};
			};
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
			recordMap: Pick<RecordMap, 'block' | 'space'>;
		}
	>;
	authWithTrello: INotionEndpoint<
		{
			requestToken: string;
			verifier: string;
		},
		Record<string, unknown>
	>;
	authWithAsana: INotionEndpoint<{ code: string; encryptedState: string }, Record<string, unknown>>;
	disconnectAsana: INotionEndpoint<{ code: string; encryptedState: string }, Record<string, unknown>>;
	disconnectTrello: INotionEndpoint<Record<string, unknown>, Record<string, unknown>>;
	authWithEvernote: INotionEndpoint<
		{
			requestToken: string;
			verifier: string;
		},
		Record<string, unknown>
	>;
	authWithGoogleForDrive: INotionEndpoint<{ code: string }, { accessToken: string; id: string }>;

	initializePageTemplate: INotionEndpoint<
		{
			recordMap: Record<string, unknown>;
			sourceBlockId: string;
			spaceId: string;
			targetBlockId: string;
		},
		{
			recordMap: Pick<RecordMap, 'block'>;
		}
	>;

	loadBlockSubtree: INotionEndpoint<
		{
			blockId: string;
			shallow: boolean;
		},
		{
			subtreeRecordMap: Pick<RecordMap, 'block' | 'space' | 'collection_view' | 'collection'>;
		}
	>;

	getSpaces: INotionEndpoint<
		Record<string, never>,
		{
			[k: string]: Pick<
				RecordMap,
				| 'block'
				| 'collection'
				| 'collection_view'
				| 'space'
				| 'space_view'
				| 'notion_user'
				| 'user_settings'
				| 'user_root'
			>;
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
			empty?: boolean;
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
				loadContentCover?: boolean;
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
			recordMap: Pick<RecordMap, 'block'>;
		}
	>;

	syncRecordValues: INotionEndpoint<
		{
			requests: {
				id: string;
				table: TDataType;
				version: number;
			}[];
		},
		{
			recordMap: Partial<RecordMap>;
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
			recordMap: Pick<RecordMap, 'space'>;
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
			recordMap: Pick<RecordMap, 'block' | 'space'>;
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
			recordMap: Partial<RecordMap>;
		}
	>;
	loadCachedPageChunk: INotionEndpoints['loadPageChunk'];
	getCsatMilestones: INotionEndpoint<Record<string, unknown>, Record<string, unknown>>;
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
	getUnvisitedNotificationIds: INotionEndpoint<
		{
			size: number;
			spaceId: string;
			timestamp: number;
			type: TNotificationChannel;
		},
		{
			notificationIds: string[];
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
		GetTasksResponse
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
