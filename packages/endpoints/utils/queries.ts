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
	GetUserNotificationsParams
} from '@nishans/types';
import { Configs, ConfigsWithoutUserid } from '../src';
import { sendRequest } from './';

export async function getPageVisits (params: GetPageVisitsParams, configs: ConfigsWithoutUserid) {
	return await sendRequest<GetPageVisitsResult>('getPageVisits', params, configs);
}

export async function getUserSharedPages (params: GetUserSharedPagesParams, configs: ConfigsWithoutUserid) {
	return await sendRequest<GetUserSharedPagesResult>('getUserSharedPages', params, configs);
}

export async function getUserTasks (configs: Configs) {
	return await sendRequest<GetUserTasksResult>('getUserTasks', {}, configs);
}

export async function getPublicPageData (params: GetPublicPageDataParams, configs: ConfigsWithoutUserid) {
	return await sendRequest<GetPublicPageDataResult>('getPublicPageData', params, configs);
}

export async function getPublicSpaceData (params: GetPublicSpaceDataParams, configs: ConfigsWithoutUserid) {
	return await sendRequest<GetPublicSpaceDataResult>('getPublicSpaceData', params, configs);
}

export async function getSubscriptionData (params: GetSubscriptionDataParams, configs: ConfigsWithoutUserid) {
	return await sendRequest<GetSubscriptionDataResult>('getSubscriptionData', params, configs);
}

export async function loadBlockSubtree (params: LoadBlockSubtreeParams, configs: ConfigsWithoutUserid) {
	return await sendRequest<LoadBlockSubtreeResult>('loadBlockSubtree', params, configs);
}

export async function getSpaces (configs: ConfigsWithoutUserid) {
	return await sendRequest<GetSpacesResult>('getSpaces', {}, configs);
}

export async function getGenericEmbedBlockData (params: GetGenericEmbedBlockDataParams, configs: ConfigsWithoutUserid) {
	return await sendRequest<GetGenericEmbedBlockDataResult>('getGenericEmbedBlockData', params, configs);
}

export async function getUploadFileUrl (params: GetUploadFileUrlParams, configs: ConfigsWithoutUserid) {
	return await sendRequest<GetUploadFileUrlResult>('getUploadFileUrl', params, configs);
}

export async function getGoogleDriveAccounts (configs: ConfigsWithoutUserid) {
	return await sendRequest<GetGoogleDriveAccountsResult>('getGoogleDriveAccounts', {}, configs);
}

export async function getBacklinksForBlock (params: GetBackLinksForBlockParams, configs: ConfigsWithoutUserid) {
	return await sendRequest<GetBackLinksForBlockResult>('getBacklinksForBlock', params, configs);
}

export async function findUser (params: FindUserParams, configs: ConfigsWithoutUserid) {
	return await sendRequest<FindUserResult>('findUser', params, configs);
}

export async function syncRecordValues (params: SyncRecordValuesParams, configs: ConfigsWithoutUserid) {
	return await sendRequest<SyncRecordValuesResult>('syncRecordValues', params, configs);
}

export async function queryCollection (params: QueryCollectionParams, configs: ConfigsWithoutUserid) {
	return await sendRequest<QueryCollectionResult>('queryCollection', params, configs);
}

export async function loadUserContent (configs: ConfigsWithoutUserid) {
	return await sendRequest<LoadUserContentResult>('loadUserContent', {}, configs);
}

export async function loadPageChunk (params: LoadPageChunkParams, configs: ConfigsWithoutUserid) {
	return await sendRequest<LoadPageChunkResult>('loadPageChunk', params, configs);
}

// Test starts here
export async function getJoinableSpaces (configs: Configs) {
	return await sendRequest<GetJoinableSpacesResult>('getJoinableSpaces', {}, configs);
}

export async function isUserDomainJoinable (configs: Configs) {
	return await sendRequest<IsUserDomainJoinableResult>('isUserDomainJoinable', {}, configs);
}

export async function isEmailEducation (configs: Configs) {
	return await sendRequest<IsEmailEducationResult>('isEmailEducation', {}, configs);
}

export async function getUserNotifications (params: GetUserNotificationsParams, configs: Configs) {
	return await sendRequest<GetUserNotificationsResult>('getUserNotifications', params, configs);
}
