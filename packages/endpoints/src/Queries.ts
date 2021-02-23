import {
	CheckEmailTypeParams,
	CheckEmailTypeResult,
	FindUserParams,
	FindUserResult,
	GetBackLinksForBlockParams,
	GetBackLinksForBlockResult,
	GetClientExperimentsParams,
	GetClientExperimentsResult,
	GetGenericEmbedBlockDataParams,
	GetGenericEmbedBlockDataResult,
	GetGoogleDriveAccountsResult,
	GetJoinableSpacesResult,
	GetPageVisitsParams,
	GetPageVisitsResult,
	GetPublicPageDataParams,
	GetPublicPageDataResult,
	GetPublicSpaceDataParams,
	GetPublicSpaceDataResult,
	GetSpacesResult,
	GetSubscriptionDataParams,
	GetSubscriptionDataResult,
	GetTasksParams,
	GetTasksResult,
	GetUploadFileUrlParams,
	GetUploadFileUrlResult,
	GetUserNotificationsParams,
	GetUserNotificationsResult,
	GetUserSharedPagesParams,
	GetUserSharedPagesResult,
	GetUserTasksResult,
	IsEmailEducationResult,
	IsUserDomainJoinableResult,
	LoadBlockSubtreeParams,
	LoadBlockSubtreeResult,
	LoadPageChunkParams,
	LoadPageChunkResult,
	LoadUserContentResult,
	QueryCollectionParams,
	QueryCollectionResult,
	RecordPageVisitParams,
	RecordPageVisitResult,
	SearchParams,
	SearchResult,
	SyncRecordValuesParams,
	SyncRecordValuesResult
} from '@nishans/types';
import { NotionRequestConfigs } from '.';
import { NotionRequest } from '../utils';

const Queries = {
	async ping (configs?: Partial<NotionRequestConfigs>) {
		return await NotionRequest.send<Record<string, never>>('ping', {}, configs);
	},

	async checkEmailType (params: CheckEmailTypeParams, configs?: Partial<NotionRequestConfigs>) {
		return await NotionRequest.send<CheckEmailTypeResult>('checkEmailType', params, configs);
	},

	async getClientExperiments (params: GetClientExperimentsParams, configs?: Partial<NotionRequestConfigs>) {
		return await NotionRequest.send<GetClientExperimentsResult>('getClientExperiments', params, configs);
	},

	async getPageVisits (params: GetPageVisitsParams, configs?: Partial<NotionRequestConfigs>) {
		return await NotionRequest.send<GetPageVisitsResult>('getPageVisits', params, configs);
	},

	async getUserSharedPages (params: GetUserSharedPagesParams, configs?: Partial<NotionRequestConfigs>) {
		return await NotionRequest.send<GetUserSharedPagesResult>('getUserSharedPages', params, configs);
	},

	async getUserTasks (configs?: Partial<NotionRequestConfigs>) {
		return await NotionRequest.send<GetUserTasksResult>('getUserTasks', {}, configs);
	},

	async search (params: SearchParams, configs?: Partial<NotionRequestConfigs>) {
		return await NotionRequest.send<SearchResult>('search', params, configs);
	},

	async getPublicPageData (params: GetPublicPageDataParams, configs?: Partial<NotionRequestConfigs>) {
		return await NotionRequest.send<GetPublicPageDataResult>('getPublicPageData', params, configs);
	},

	async getPublicSpaceData (params: GetPublicSpaceDataParams, configs?: Partial<NotionRequestConfigs>) {
		return await NotionRequest.send<GetPublicSpaceDataResult>('getPublicSpaceData', params, configs);
	},

	async getSubscriptionData (params: GetSubscriptionDataParams, configs?: Partial<NotionRequestConfigs>) {
		return await NotionRequest.send<GetSubscriptionDataResult>('getSubscriptionData', params, configs);
	},

	async loadBlockSubtree (params: LoadBlockSubtreeParams, configs?: Partial<NotionRequestConfigs>) {
		return await NotionRequest.send<LoadBlockSubtreeResult>('loadBlockSubtree', params, configs);
	},

	async getSpaces (configs?: Partial<NotionRequestConfigs>) {
		return await NotionRequest.send<GetSpacesResult>('getSpaces', {}, configs);
	},

	async getGenericEmbedBlockData (params: GetGenericEmbedBlockDataParams, configs?: Partial<NotionRequestConfigs>) {
		return await NotionRequest.send<GetGenericEmbedBlockDataResult>('getGenericEmbedBlockData', params, configs);
	},

	async getUploadFileUrl (params: GetUploadFileUrlParams, configs?: Partial<NotionRequestConfigs>) {
		return await NotionRequest.send<GetUploadFileUrlResult>('getUploadFileUrl', params, configs);
	},

	async getGoogleDriveAccounts (configs?: Partial<NotionRequestConfigs>) {
		return await NotionRequest.send<GetGoogleDriveAccountsResult>('getGoogleDriveAccounts', {}, configs);
	},

	async getBacklinksForBlock (params: GetBackLinksForBlockParams, configs?: Partial<NotionRequestConfigs>) {
		return await NotionRequest.send<GetBackLinksForBlockResult>('getBacklinksForBlock', params, configs);
	},

	async findUser (params: FindUserParams, configs?: Partial<NotionRequestConfigs>) {
		return await NotionRequest.send<FindUserResult>('findUser', params, configs);
	},

	async syncRecordValues (params: SyncRecordValuesParams, configs?: Partial<NotionRequestConfigs>) {
		return await NotionRequest.send<SyncRecordValuesResult>('syncRecordValues', params, configs);
	},

	async queryCollection (params: QueryCollectionParams, configs?: Partial<NotionRequestConfigs>) {
		return await NotionRequest.send<QueryCollectionResult>('queryCollection', params, configs);
	},

	async loadUserContent (configs?: Partial<NotionRequestConfigs>) {
		return await NotionRequest.send<LoadUserContentResult>('loadUserContent', {}, configs);
	},

	async loadPageChunk (params: LoadPageChunkParams, configs?: Partial<NotionRequestConfigs>) {
		return await NotionRequest.send<LoadPageChunkResult>('loadPageChunk', params, configs);
	},

	async recordPageVisit (params: RecordPageVisitParams, configs?: Partial<NotionRequestConfigs>) {
		return await NotionRequest.send<RecordPageVisitResult>('recordPageVisit', params, configs);
	},

	async getJoinableSpaces (configs?: Partial<NotionRequestConfigs>) {
		return await NotionRequest.send<GetJoinableSpacesResult>('getJoinableSpaces', {}, configs);
	},

	async isUserDomainJoinable (configs?: Partial<NotionRequestConfigs>) {
		return await NotionRequest.send<IsUserDomainJoinableResult>('isUserDomainJoinable', {}, configs);
	},

	async isEmailEducation (configs?: Partial<NotionRequestConfigs>) {
		return await NotionRequest.send<IsEmailEducationResult>('isEmailEducation', {}, configs);
	},

	async getUserNotifications (params: GetUserNotificationsParams, configs?: Partial<NotionRequestConfigs>) {
		return await NotionRequest.send<GetUserNotificationsResult>('getUserNotifications', params, configs);
	},

	async getTasks (params: GetTasksParams, configs?: Partial<NotionRequestConfigs>) {
		return await NotionRequest.send<GetTasksResult>('getTasks', params, configs);
	}
};

export default Queries;
