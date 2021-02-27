import { NotionEndpoints } from '@nishans/types';
import { NotionRequest, NotionRequestConfigs } from '.';

export const NotionQueries = {
	async ping (configs?: Partial<NotionRequestConfigs>) {
		return await NotionRequest.send<Record<string, never>>('ping', {}, configs);
	},

	async checkEmailType (params: NotionEndpoints['checkEmailType']['payload'], configs?: Partial<NotionRequestConfigs>) {
		return await NotionRequest.send<NotionEndpoints['checkEmailType']['response']>('checkEmailType', params, configs);
	},

	async getClientExperiments (
		params: NotionEndpoints['getClientExperiments']['payload'],
		configs?: Partial<NotionRequestConfigs>
	) {
		return await NotionRequest.send<NotionEndpoints['getClientExperiments']['response']>(
			'getClientExperiments',
			params,
			configs
		);
	},

	async getPageVisits (params: NotionEndpoints['getPageVisits']['payload'], configs?: Partial<NotionRequestConfigs>) {
		return await NotionRequest.send<NotionEndpoints['getPageVisits']['response']>('getPageVisits', params, configs);
	},

	async getUserSharedPages (
		params: NotionEndpoints['getUserSharedPages']['payload'],
		configs?: Partial<NotionRequestConfigs>
	) {
		return await NotionRequest.send<NotionEndpoints['getUserSharedPages']['response']>(
			'getUserSharedPages',
			params,
			configs
		);
	},

	async getUserTasks (configs?: Partial<NotionRequestConfigs>) {
		return await NotionRequest.send<NotionEndpoints['getUserTasks']['response']>('getUserTasks', {}, configs);
	},

	async search (params: NotionEndpoints['search']['payload'], configs?: Partial<NotionRequestConfigs>) {
		return await NotionRequest.send<NotionEndpoints['search']['response']>('search', params, configs);
	},

	async getPublicPageData (
		params: NotionEndpoints['getPublicPageData']['payload'],
		configs?: Partial<NotionRequestConfigs>
	) {
		return await NotionRequest.send<NotionEndpoints['getPublicPageData']['response']>(
			'getPublicPageData',
			params,
			configs
		);
	},

	async getPublicSpaceData (
		params: NotionEndpoints['getPublicSpaceData']['payload'],
		configs?: Partial<NotionRequestConfigs>
	) {
		return await NotionRequest.send<NotionEndpoints['getPublicSpaceData']['response']>(
			'getPublicSpaceData',
			params,
			configs
		);
	},

	async getSubscriptionData (
		params: NotionEndpoints['getSubscriptionData']['payload'],
		configs?: Partial<NotionRequestConfigs>
	) {
		return await NotionRequest.send<NotionEndpoints['getSubscriptionData']['response']>(
			'getSubscriptionData',
			params,
			configs
		);
	},

	async loadBlockSubtree (
		params: NotionEndpoints['loadBlockSubtree']['payload'],
		configs?: Partial<NotionRequestConfigs>
	) {
		return await NotionRequest.send<NotionEndpoints['loadBlockSubtree']['response']>(
			'loadBlockSubtree',
			params,
			configs
		);
	},

	async getSpaces (configs?: Partial<NotionRequestConfigs>) {
		return await NotionRequest.send<NotionEndpoints['getSpaces']['response']>('getSpaces', {}, configs);
	},

	async getGenericEmbedBlockData (
		params: NotionEndpoints['getGenericEmbedBlockData']['payload'],
		configs?: Partial<NotionRequestConfigs>
	) {
		return await NotionRequest.send<NotionEndpoints['getGenericEmbedBlockData']['response']>(
			'getGenericEmbedBlockData',
			params,
			configs
		);
	},

	async getUploadFileUrl (
		params: NotionEndpoints['getUploadFileUrl']['payload'],
		configs?: Partial<NotionRequestConfigs>
	) {
		return await NotionRequest.send<NotionEndpoints['getUploadFileUrl']['response']>(
			'getUploadFileUrl',
			params,
			configs
		);
	},

	async getGoogleDriveAccounts (configs?: Partial<NotionRequestConfigs>) {
		return await NotionRequest.send<NotionEndpoints['getGoogleDriveAccounts']['response']>(
			'getGoogleDriveAccounts',
			{},
			configs
		);
	},

	async getBacklinksForBlock (
		params: NotionEndpoints['getBacklinksForBlock']['payload'],
		configs?: Partial<NotionRequestConfigs>
	) {
		return await NotionRequest.send<NotionEndpoints['getBacklinksForBlock']['response']>(
			'getBacklinksForBlock',
			params,
			configs
		);
	},

	async findUser (params: NotionEndpoints['findUser']['payload'], configs?: Partial<NotionRequestConfigs>) {
		return await NotionRequest.send<NotionEndpoints['findUser']['response']>('findUser', params, configs);
	},

	async syncRecordValues (
		params: NotionEndpoints['syncRecordValues']['payload'],
		configs?: Partial<NotionRequestConfigs>
	) {
		return await NotionRequest.send<NotionEndpoints['syncRecordValues']['response']>(
			'syncRecordValues',
			params,
			configs
		);
	},

	async queryCollection (
		params: NotionEndpoints['queryCollection']['payload'],
		configs?: Partial<NotionRequestConfigs>
	) {
		return await NotionRequest.send<NotionEndpoints['queryCollection']['response']>('queryCollection', params, configs);
	},

	async loadUserContent (configs?: Partial<NotionRequestConfigs>) {
		return await NotionRequest.send<NotionEndpoints['loadUserContent']['response']>('loadUserContent', {}, configs);
	},

	async loadPageChunk (params: NotionEndpoints['loadPageChunk']['payload'], configs?: Partial<NotionRequestConfigs>) {
		return await NotionRequest.send<NotionEndpoints['loadPageChunk']['response']>('loadPageChunk', params, configs);
	},

	async recordPageVisit (
		params: NotionEndpoints['recordPageVisit']['payload'],
		configs?: Partial<NotionRequestConfigs>
	) {
		return await NotionRequest.send<NotionEndpoints['recordPageVisit']['response']>('recordPageVisit', params, configs);
	},

	async getJoinableSpaces (configs?: Partial<NotionRequestConfigs>) {
		return await NotionRequest.send<NotionEndpoints['getJoinableSpaces']['response']>('getJoinableSpaces', {}, configs);
	},

	async isUserDomainJoinable (configs?: Partial<NotionRequestConfigs>) {
		return await NotionRequest.send<NotionEndpoints['isUserDomainJoinable']['response']>(
			'isUserDomainJoinable',
			{},
			configs
		);
	},

	async isEmailEducation (configs?: Partial<NotionRequestConfigs>) {
		return await NotionRequest.send<NotionEndpoints['isEmailEducation']['response']>('isEmailEducation', {}, configs);
	},

	async getUserNotifications (
		params: NotionEndpoints['getUserNotifications']['payload'],
		configs?: Partial<NotionRequestConfigs>
	) {
		return await NotionRequest.send<NotionEndpoints['getUserNotifications']['response']>(
			'getUserNotifications',
			params,
			configs
		);
	},

	async getTasks (params: NotionEndpoints['getTasks']['payload'], configs?: Partial<NotionRequestConfigs>) {
		return await NotionRequest.send<NotionEndpoints['getTasks']['response']>('getTasks', params, configs);
	}
};
