import {
	GetPageVisitsParams,
	GetPageVisitsResult,
	GetUserSharedPagesParams,
	GetUserSharedPagesResult,
	GetUserTasksResult,
	GetPublicPageDataParams,
	GetPublicPageDataResult,
	GetPublicSpaceDataParams,
	GetPublicSpaceDataResult,
	GetSubscriptionDataParams,
	GetSubscriptionDataResult,
	LoadBlockSubtreeParams,
	LoadBlockSubtreeResult,
	GetGenericEmbedBlockDataParams,
	GetGenericEmbedBlockDataResult,
	GetUploadFileUrlParams,
	GetUploadFileUrlResult,
	GetGoogleDriveAccountsResult,
	GetBackLinksForBlockResult,
	FindUserResult,
	SyncRecordValuesParams,
	SyncRecordValuesResult,
	QueryCollectionParams,
	QueryCollectionResult,
	LoadUserContentResult,
	LoadPageChunkParams,
	LoadPageChunkResult,
	GetSpacesResult,
	GetBackLinksForBlockParams,
	FindUserParams,
	GetJoinableSpacesResult,
	IsUserDomainJoinableResult,
	IsEmailEducationResult,
	GetUserNotificationsResult,
	GetUserNotificationsParams,
	GetTasksParams,
	GetTasksResult,
	RecordPageVisitResult,
	RecordPageVisitParams
} from '@nishans/types';

import { NotionRequestConfigs } from '.';
import { sendRequest } from '../utils';

const Queries = {
	async getPageVisits (params: GetPageVisitsParams, configs?: Partial<NotionRequestConfigs>) {
		return await sendRequest<GetPageVisitsResult>('getPageVisits', params, configs);
	},

	async getUserSharedPages (params: GetUserSharedPagesParams, configs?: Partial<NotionRequestConfigs>) {
		return await sendRequest<GetUserSharedPagesResult>('getUserSharedPages', params, configs);
	},

	async getUserTasks (configs?: Partial<NotionRequestConfigs>) {
		return await sendRequest<GetUserTasksResult>('getUserTasks', {}, configs);
	},

	async getPublicPageData (params: GetPublicPageDataParams, configs?: Partial<NotionRequestConfigs>) {
		return await sendRequest<GetPublicPageDataResult>('getPublicPageData', params, configs);
	},

	async getPublicSpaceData (params: GetPublicSpaceDataParams, configs?: Partial<NotionRequestConfigs>) {
		return await sendRequest<GetPublicSpaceDataResult>('getPublicSpaceData', params, configs);
	},

	async getSubscriptionData (params: GetSubscriptionDataParams, configs?: Partial<NotionRequestConfigs>) {
		return await sendRequest<GetSubscriptionDataResult>('getSubscriptionData', params, configs);
	},

	async loadBlockSubtree (params: LoadBlockSubtreeParams, configs?: Partial<NotionRequestConfigs>) {
		return await sendRequest<LoadBlockSubtreeResult>('loadBlockSubtree', params, configs);
	},

	async getSpaces (configs?: Partial<NotionRequestConfigs>) {
		return await sendRequest<GetSpacesResult>('getSpaces', {}, configs);
	},

	async getGenericEmbedBlockData (params: GetGenericEmbedBlockDataParams, configs?: Partial<NotionRequestConfigs>) {
		return await sendRequest<GetGenericEmbedBlockDataResult>('getGenericEmbedBlockData', params, configs);
	},

	async getUploadFileUrl (params: GetUploadFileUrlParams, configs?: Partial<NotionRequestConfigs>) {
		return await sendRequest<GetUploadFileUrlResult>('getUploadFileUrl', params, configs);
	},

	async getGoogleDriveAccounts (configs?: Partial<NotionRequestConfigs>) {
		return await sendRequest<GetGoogleDriveAccountsResult>('getGoogleDriveAccounts', {}, configs);
	},

	async getBacklinksForBlock (params: GetBackLinksForBlockParams, configs?: Partial<NotionRequestConfigs>) {
		return await sendRequest<GetBackLinksForBlockResult>('getBacklinksForBlock', params, configs);
	},

	async findUser (params: FindUserParams, configs?: Partial<NotionRequestConfigs>) {
		return await sendRequest<FindUserResult>('findUser', params, configs);
	},

	async syncRecordValues (params: SyncRecordValuesParams, configs?: Partial<NotionRequestConfigs>) {
		return await sendRequest<SyncRecordValuesResult>('syncRecordValues', params, configs);
	},

	async queryCollection (params: QueryCollectionParams, configs?: Partial<NotionRequestConfigs>) {
		return await sendRequest<QueryCollectionResult>('queryCollection', params, configs);
	},

	async loadUserContent (configs?: Partial<NotionRequestConfigs>) {
		return await sendRequest<LoadUserContentResult>('loadUserContent', {}, configs);
	},

	async loadPageChunk (params: LoadPageChunkParams, configs?: Partial<NotionRequestConfigs>) {
		return await sendRequest<LoadPageChunkResult>('loadPageChunk', params, configs);
	},

	async recordPageVisit (params: RecordPageVisitParams, configs?: Partial<NotionRequestConfigs>) {
		return await sendRequest<RecordPageVisitResult>('recordPageVisit', params, configs);
	},

	async getJoinableSpaces (configs?: Partial<NotionRequestConfigs>) {
		return await sendRequest<GetJoinableSpacesResult>('getJoinableSpaces', {}, configs);
	},

	async isUserDomainJoinable (configs?: Partial<NotionRequestConfigs>) {
		return await sendRequest<IsUserDomainJoinableResult>('isUserDomainJoinable', {}, configs);
	},

	async isEmailEducation (configs?: Partial<NotionRequestConfigs>) {
		return await sendRequest<IsEmailEducationResult>('isEmailEducation', {}, configs);
	},

	async getUserNotifications (params: GetUserNotificationsParams, configs?: Partial<NotionRequestConfigs>) {
		return await sendRequest<GetUserNotificationsResult>('getUserNotifications', params, configs);
	},

	async getTasks (params: GetTasksParams, configs?: Partial<NotionRequestConfigs>) {
		return await sendRequest<GetTasksResult>('getTasks', params, configs);
	}
};

export default Queries;
