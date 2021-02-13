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

import { Configs } from '.';
import { sendRequest } from '../utils';

const Queries = {
	async getPageVisits (params: GetPageVisitsParams, configs?: Partial<Configs>) {
		return await sendRequest<GetPageVisitsResult>('getPageVisits', params, configs);
	},

	async getUserSharedPages (params: GetUserSharedPagesParams, configs?: Partial<Configs>) {
		return await sendRequest<GetUserSharedPagesResult>('getUserSharedPages', params, configs);
	},

	async getUserTasks (configs?: Partial<Configs>) {
		return await sendRequest<GetUserTasksResult>('getUserTasks', {}, configs);
	},

	async getPublicPageData (params: GetPublicPageDataParams, configs?: Partial<Configs>) {
		return await sendRequest<GetPublicPageDataResult>('getPublicPageData', params, configs);
	},

	async getPublicSpaceData (params: GetPublicSpaceDataParams, configs?: Partial<Configs>) {
		return await sendRequest<GetPublicSpaceDataResult>('getPublicSpaceData', params, configs);
	},

	async getSubscriptionData (params: GetSubscriptionDataParams, configs?: Partial<Configs>) {
		return await sendRequest<GetSubscriptionDataResult>('getSubscriptionData', params, configs);
	},

	async loadBlockSubtree (params: LoadBlockSubtreeParams, configs?: Partial<Configs>) {
		return await sendRequest<LoadBlockSubtreeResult>('loadBlockSubtree', params, configs);
	},

	async getSpaces (configs?: Partial<Configs>) {
		return await sendRequest<GetSpacesResult>('getSpaces', {}, configs);
	},

	async getGenericEmbedBlockData (params: GetGenericEmbedBlockDataParams, configs?: Partial<Configs>) {
		return await sendRequest<GetGenericEmbedBlockDataResult>('getGenericEmbedBlockData', params, configs);
	},

	async getUploadFileUrl (params: GetUploadFileUrlParams, configs?: Partial<Configs>) {
		return await sendRequest<GetUploadFileUrlResult>('getUploadFileUrl', params, configs);
	},

	async getGoogleDriveAccounts (configs?: Partial<Configs>) {
		return await sendRequest<GetGoogleDriveAccountsResult>('getGoogleDriveAccounts', {}, configs);
	},

	async getBacklinksForBlock (params: GetBackLinksForBlockParams, configs?: Partial<Configs>) {
		return await sendRequest<GetBackLinksForBlockResult>('getBacklinksForBlock', params, configs);
	},

	async findUser (params: FindUserParams, configs?: Partial<Configs>) {
		return await sendRequest<FindUserResult>('findUser', params, configs);
	},

	async syncRecordValues (params: SyncRecordValuesParams, configs?: Partial<Configs>) {
		return await sendRequest<SyncRecordValuesResult>('syncRecordValues', params, configs);
	},

	async queryCollection (params: QueryCollectionParams, configs?: Partial<Configs>) {
		return await sendRequest<QueryCollectionResult>('queryCollection', params, configs);
	},

	async loadUserContent (configs?: Partial<Configs>) {
		return await sendRequest<LoadUserContentResult>('loadUserContent', {}, configs);
	},

	async loadPageChunk (params: LoadPageChunkParams, configs?: Partial<Configs>) {
		return await sendRequest<LoadPageChunkResult>('loadPageChunk', params, configs);
	},

	async recordPageVisit (params: RecordPageVisitParams, configs?: Partial<Configs>) {
		return await sendRequest<RecordPageVisitResult>('recordPageVisit', params, configs);
	},

	async getJoinableSpaces (configs?: Partial<Configs>) {
		return await sendRequest<GetJoinableSpacesResult>('getJoinableSpaces', {}, configs);
	},

	async isUserDomainJoinable (configs?: Partial<Configs>) {
		return await sendRequest<IsUserDomainJoinableResult>('isUserDomainJoinable', {}, configs);
	},

	async isEmailEducation (configs?: Partial<Configs>) {
		return await sendRequest<IsEmailEducationResult>('isEmailEducation', {}, configs);
	},

	async getUserNotifications (params: GetUserNotificationsParams, configs?: Partial<Configs>) {
		return await sendRequest<GetUserNotificationsResult>('getUserNotifications', params, configs);
	},

	async getTasks (params: GetTasksParams, configs?: Partial<Configs>) {
		return await sendRequest<GetTasksResult>('getTasks', params, configs);
	}
};

export default Queries;
