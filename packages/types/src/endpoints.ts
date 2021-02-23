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
	TGenericEmbedBlockType,
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

export interface NotionEndpoints {
	checkEmailType: {
		payload: {
			allowAdminBypass: boolean;
			email: string;
		};
		response: {
			hasAccount: boolean;
			hasPassword: boolean;
			isGoogleAppsEmail: boolean;
			mustReverify: boolean;
		};
	};
	loginWithEmail: {
		payload: {
			email: string;
			password: string;
		};
		response: {
			isNewSignup: boolean;
			userId: string;
		};
	};
	getClientExperiments: {
		payload: {
			deviceId: string;
		};
		response: {
			deviceId: string;
			isLoaded: boolean;
			test: boolean;
			userId: string;
			experiments: {
				experimentId: string;
				experimentVersion: number;
				group?: string;
			}[];
		};
	};
	setPageNotificationsAsRead: {
		payload: {
			navigableBlockId: string;
			spaceId: string;
			timestamp: number;
		};
		response: Record<string, never>;
	};
	setSpaceNotificationsAsRead: {
		payload: {
			spaceId: string;
			timestamp: number;
		};
		response: Record<string, never>;
	};
	getPageVisits: {
		payload: {
			blockId: string;
			limit: number;
		};
		response: {
			recordMap: {
				page_visit: {
					[key: string]: {
						role: TPermissionRole;
						value: IPageVisits;
					};
				};
			};
			pageVisits: IPageVisits[];
		};
	};
	getUserSharedPages: {
		payload: {
			includeDeleted?: boolean;
		};
		response: {
			pages: { id: string; spaceId: string }[];
			recordMap: Pick<RecordMap, 'block' | 'collection' | 'space'>;
		};
	};
	getPublicPageData: {
		payload: {
			blockId?: string;
			name?: 'page';
			saveParent?: boolean;
			showMoveTo?: boolean;
			type?: 'block-space';
		};
		response: {
			betaEnabled: boolean;
			canJoinSpace: boolean;
			canRequestAccess: boolean;
			hasPublicAccess: boolean;
			icon: string;
			ownerUserId: string;
			spaceId: string;
			spaceName: string;
			userHasExplicitAccess: boolean;
		};
	};

	getPublicSpaceData: {
		payload: {
			type: 'space-ids';
			spaceIds: string[];
		};
		response: {
			results: IPublicSpaceData[];
		};
	};

	getSubscriptionData: {
		payload: {
			spaceId: string;
		};
		response: UnsubscribedSubscriptionData | SubscribedSubscriptionData;
	};

	removeUsersFromSpace: {
		payload: {
			removePagePermissions: boolean;
			revokeUserTokens: boolean;
			spaceId: string;
			userIds: string[];
		};
		response: {
			recordMap: {
				block: BlockData;
				space: SpaceData;
			};
		};
	};

	initializePageTemplate: {
		payload: {
			recordMap: Record<string, unknown>;
			sourceBlockId: string;
			spaceId: string;
			targetBlockId: string;
		};
		response: {
			recordMap: {
				block: BlockData;
			};
		};
	};

	loadBlockSubtree: {
		payload: {
			blockId: string;
			shallow: boolean;
		};
		response: {
			subtreeRecordMap: {
				block: BlockData;
			};
		};
	};

	getSpaces: {
		payload: Record<string, never>;
		response: {
			[k: string]: RecordMap;
		};
	};

	getGenericEmbedBlockData: {
		payload: {
			pageWidth: number;
			source: string;
			type: TGenericEmbedBlockType;
		};
		response: {
			format: MediaFormat;
			properties: {
				source: string[][];
			};
			type: TGenericEmbedBlockType;
		};
	};

	getUploadFileUrl: {
		payload: {
			bucket: 'secure';
			contentType: string;
			name: string;
		};
		response: {
			signedGetUrl: string;
			signedPutUrl: string;
			url: string;
		};
	};

	setBookmarkMetadata: {
		payload: {
			blockId: string;
			url: string;
		};
		response: Record<string, never>;
	};

	queryCollection: {
		payload: {
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
		};
		response: {
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
		};
	};
	getGoogleDriveAccounts: {
		payload: Record<string, unknown>;
		response: {
			accounts: {
				accountId: string;
				accountName: string;
				token: Token;
			}[];
		};
	};
	initializeGoogleDriveBlock: {
		payload: {
			blockId: string;
			fileId: string;
			token: Token;
		};
		response: {
			file: GoogleDriveFile;
			recordMap: {
				block: {
					[key: string]: IDrive;
				};
			};
		};
	};

	getBackLinksForBlock: {
		payload: {
			blockId: string;
		};
		response: {
			recordMap: {
				block: BlockData;
			};
		};
	};

	syncRecordValues: {
		payload: {
			requests: {
				id: string;
				table: TOperationTable;
				version: number;
			}[];
		};
		response: {
			recordMap: RecordMap;
		};
	};

	findUser: {
		payload: {
			email: string;
		};
		response: {
			value?: {
				role: TPermissionRole;
				value: INotionUser;
			};
		};
	};

	createSpace: {
		payload: {
			icon: string;
			initialUseCases: string[];
			name: string;
			planType: 'personal';
		};
		response: {
			recordMap: {
				space: SpaceData;
			};
			spaceId: string;
		};
	};

	loadUserContent: {
		payload: Record<string, unknown>;
		response: {
			recordMap: Omit<RecordMap, 'collection_view'>;
		};
	};

	getUserSharePages: {
		payload: Record<string, unknown>;
		response: {
			pages: { id: string; spaceId: string }[];
			recordMap: {
				block: BlockData;
				space: SpaceData;
			};
		};
	};

	inviteGuestsToSpace: {
		payload: {
			blockId: string;
			permissionItems: IPermission[];
			spaceId: string;
		};
		response: Record<string, unknown>;
	};

	loadPageChunk: {
		payload: {
			chunkNumber: number;
			cursor: Cursor;
			limit: number;
			pageId: string;
			verticalColumns: boolean;
		};
		response: {
			cursor: Cursor;
			recordMap: RecordMap;
		};
	};

	getUserTasks: {
		payload: Record<string, unknown>;
		response: {
			taskIds: string[];
		};
	};

	saveTransaction: {
		payload: {
			requestId: string;
			transactions: Transaction[];
		};
		response: Record<string, unknown>;
	};

	getJoinableSpace: {
		response: {
			results: {
				id: string;
				name: string;
				canJoinSpace: boolean;
				guestPageIds: string[];
			}[];
		};
		payload: Record<string, unknown>;
	};

	isUserDomainJoinable: {
		payload: Record<string, unknown>;
		response: {
			isJoinable: boolean;
		};
	};

	isEmailEducation: {
		payload: Record<string, unknown>;
		response: {
			isEligible: boolean;
		};
	};

	getUserNotifications: {
		payload: {
			size: number;
		};
		result: {
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
		};
	};

	getTasks: {
		payload: {
			taskIds: string[];
		};
		response: Record<string, unknown>;
	};
	recordPageVisit: {
		payload: {
			blockId: string;
			timestamp: number;
		};
		response: NotionEndpoints['getPageVisits']['response'];
	};

	search: {
		payload: {
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
		response: {
			recordMap: Pick<RecordMap, 'block' | 'collection' | 'space'>;
			results: {
				id: string;
				isNavigable: boolean;
				score: number;
			}[];
			total: number;
		};
	};
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
