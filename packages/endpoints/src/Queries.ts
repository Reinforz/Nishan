import Cache from './Cache';

import {
	RecordPageVisitParams,
	GetTasksParams,
	GetUserNotificationsParams,
	SyncRecordValues,
	GetPageVisitsParams,
	GetBackLinksForBlockParams,
	GetUserSharedPagesParams,
	GetPublicPageDataParams,
	GetPublicSpaceDataParams,
	GetSubscriptionDataParams,
	LoadBlockSubtreeParams,
	GetGenericEmbedBlockDataParams,
	GetUploadFileUrlParams,
	SyncRecordValuesParams,
	QueryCollectionParams,
	LoadPageChunkParams,
	TDataType,
	FindUserParams
} from '@nishans/types';
import { Configs, CtorArgs, UpdateCacheManuallyParam } from './types';
import {
	findUser,
	getBacklinksForBlock,
	getGenericEmbedBlockData,
	getGoogleDriveAccounts,
	getJoinableSpaces,
	getPageVisits,
	getPublicPageData,
	getPublicSpaceData,
	getSpaces,
	getSubscriptionData,
	getTasks,
	getUploadFileUrl,
	getUserNotifications,
	getUserSharedPages,
	getUserTasks,
	isEmailEducation,
	isUserDomainJoinable,
	loadBlockSubtree,
	loadPageChunk,
	loadUserContent,
	queryCollection,
	recordPageVisit,
	syncRecordValues
} from '../utils';

/**
 * A class containing all the api endpoints of Notion
 * @noInheritDoc
 */
export default class Queries extends Cache {
	constructor (params: Omit<CtorArgs, 'shard_id' | 'space_id'>) {
		super(params);
	}

	async getPageVisits (arg: GetPageVisitsParams) {
		return await getPageVisits(arg, this.getConfigs());
	}

	async getUserSharedPages (arg: GetUserSharedPagesParams) {
		return await getUserSharedPages(arg, this.getConfigs());
	}

	async getUserTasks () {
		return await getUserTasks(this.getConfigs());
	}

	async getPublicPageData (arg: GetPublicPageDataParams) {
		return await getPublicPageData(arg, this.getConfigs());
	}

	async getPublicSpaceData (arg: GetPublicSpaceDataParams) {
		return await getPublicSpaceData(arg, this.getConfigs());
	}

	async getSubscriptionData (arg: GetSubscriptionDataParams) {
		return await getSubscriptionData(arg, this.getConfigs());
	}

	async loadBlockSubtree (arg: LoadBlockSubtreeParams) {
		const data = await loadBlockSubtree(arg, this.getConfigs());
		this.saveToCache(data.subtreeRecordMap);
		return data;
	}

	async getSpaces () {
		const data = await getSpaces(this.getConfigs());
		Object.values(data).forEach((data) => this.saveToCache(data));
		return data;
	}

	async getGenericEmbedBlockData (arg: GetGenericEmbedBlockDataParams) {
		return await getGenericEmbedBlockData(arg, this.getConfigs());
	}

	async getUploadFileUrl (arg: GetUploadFileUrlParams) {
		return await getUploadFileUrl(arg, this.getConfigs());
	}

	async getGoogleDriveAccounts () {
		return await getGoogleDriveAccounts(this.getConfigs());
	}

	async getBacklinksForBlock (params: GetBackLinksForBlockParams) {
		const data = await getBacklinksForBlock(params, this.getConfigs());
		this.saveToCache(data.recordMap);
		return data;
	}

	async findUser (params: FindUserParams) {
		return await findUser(params, this.getConfigs());
	}

	async syncRecordValues (params: SyncRecordValuesParams) {
		const data = await syncRecordValues(params, this.getConfigs());
		this.saveToCache(data.recordMap);
		return data;
	}

	async queryCollection (params: QueryCollectionParams) {
		const data = await queryCollection(params, this.getConfigs());
		this.saveToCache(data.recordMap);
		return data;
	}

	async loadUserContent () {
		const data = await loadUserContent(this.getConfigs());
		this.saveToCache(data.recordMap);
		return data;
	}

	async loadPageChunk (params: LoadPageChunkParams) {
		const data = await loadPageChunk(params, this.getConfigs());
		this.saveToCache(data.recordMap);
		return data;
	}

	async getJoinableSpaces () {
		return await getJoinableSpaces(this.getConfigs());
	}

	async isUserDomainJoinable () {
		return await isUserDomainJoinable(this.getConfigs());
	}

	async isEmailEducation () {
		return await isEmailEducation(this.getConfigs());
	}

	async getUserNotifications (params: GetUserNotificationsParams) {
		return await getUserNotifications(params, this.getConfigs());
	}

	async getTasks (params: GetTasksParams) {
		return await getTasks(params, this.getConfigs());
	}

	async recordPageVisit (params: RecordPageVisitParams) {
		return await recordPageVisit(params, this.getConfigs());
	}
}
