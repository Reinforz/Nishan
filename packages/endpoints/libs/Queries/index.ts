import { INotionEndpoints } from '@nishans/types';
import { NotionEndpoints, NotionEndpointsOptions } from '../';

export const NotionEndpointsQueries = {
	async ping (configs?: NotionEndpointsOptions) {
		return await NotionEndpoints.Request.send<Record<string, never>>('ping', {}, configs);
	},

	async checkEmailType (params: INotionEndpoints['checkEmailType']['payload'], configs?: NotionEndpointsOptions) {
		return await NotionEndpoints.Request.send<INotionEndpoints['checkEmailType']['response']>(
			'checkEmailType',
			params,
			configs
		);
	},

	async getClientExperiments (
		params: INotionEndpoints['getClientExperiments']['payload'],
		configs?: NotionEndpointsOptions
	) {
		return await NotionEndpoints.Request.send<INotionEndpoints['getClientExperiments']['response']>(
			'getClientExperiments',
			params,
			configs
		);
	},

	async getPageVisits (params: INotionEndpoints['getPageVisits']['payload'], configs?: NotionEndpointsOptions) {
		return await NotionEndpoints.Request.send<INotionEndpoints['getPageVisits']['response']>(
			'getPageVisits',
			params,
			configs
		);
	},

	async getUserSharedPages (
		params: INotionEndpoints['getUserSharedPages']['payload'],
		configs?: NotionEndpointsOptions
	) {
		return await NotionEndpoints.Request.send<INotionEndpoints['getUserSharedPages']['response']>(
			'getUserSharedPages',
			params,
			configs
		);
	},

	async getUserTasks (configs?: NotionEndpointsOptions) {
		return await NotionEndpoints.Request.send<INotionEndpoints['getUserTasks']['response']>(
			'getUserTasks',
			{},
			configs
		);
	},

	async search (params: INotionEndpoints['search']['payload'], configs?: NotionEndpointsOptions) {
		return await NotionEndpoints.Request.send<INotionEndpoints['search']['response']>('search', params, configs);
	},

	async getPublicPageData (params: INotionEndpoints['getPublicPageData']['payload'], configs?: NotionEndpointsOptions) {
		return await NotionEndpoints.Request.send<INotionEndpoints['getPublicPageData']['response']>(
			'getPublicPageData',
			params,
			configs
		);
	},

	async getPublicSpaceData (
		params: INotionEndpoints['getPublicSpaceData']['payload'],
		configs?: NotionEndpointsOptions
	) {
		return await NotionEndpoints.Request.send<INotionEndpoints['getPublicSpaceData']['response']>(
			'getPublicSpaceData',
			params,
			configs
		);
	},

	async getSubscriptionData (
		params: INotionEndpoints['getSubscriptionData']['payload'],
		configs?: NotionEndpointsOptions
	) {
		return await NotionEndpoints.Request.send<INotionEndpoints['getSubscriptionData']['response']>(
			'getSubscriptionData',
			params,
			configs
		);
	},

	async loadBlockSubtree (params: INotionEndpoints['loadBlockSubtree']['payload'], configs?: NotionEndpointsOptions) {
		return await NotionEndpoints.Request.send<INotionEndpoints['loadBlockSubtree']['response']>(
			'loadBlockSubtree',
			params,
			configs
		);
	},

	async getSpaces (configs?: NotionEndpointsOptions) {
		return await NotionEndpoints.Request.send<INotionEndpoints['getSpaces']['response']>('getSpaces', {}, configs);
	},

	async getGenericEmbedBlockData (
		params: INotionEndpoints['getGenericEmbedBlockData']['payload'],
		configs?: NotionEndpointsOptions
	) {
		return await NotionEndpoints.Request.send<INotionEndpoints['getGenericEmbedBlockData']['response']>(
			'getGenericEmbedBlockData',
			params,
			configs
		);
	},

	async getUploadFileUrl (params: INotionEndpoints['getUploadFileUrl']['payload'], configs?: NotionEndpointsOptions) {
		return await NotionEndpoints.Request.send<INotionEndpoints['getUploadFileUrl']['response']>(
			'getUploadFileUrl',
			params,
			configs
		);
	},

	async getGoogleDriveAccounts (configs?: NotionEndpointsOptions) {
		return await NotionEndpoints.Request.send<INotionEndpoints['getGoogleDriveAccounts']['response']>(
			'getGoogleDriveAccounts',
			{},
			configs
		);
	},

	async getBacklinksForBlock (
		params: INotionEndpoints['getBacklinksForBlock']['payload'],
		configs?: NotionEndpointsOptions
	) {
		return await NotionEndpoints.Request.send<INotionEndpoints['getBacklinksForBlock']['response']>(
			'getBacklinksForBlock',
			params,
			configs
		);
	},

	async findUser (params: INotionEndpoints['findUser']['payload'], configs?: NotionEndpointsOptions) {
		return await NotionEndpoints.Request.send<INotionEndpoints['findUser']['response']>('findUser', params, configs);
	},

	async syncRecordValues (params: INotionEndpoints['syncRecordValues']['payload'], configs?: NotionEndpointsOptions) {
		return await NotionEndpoints.Request.send<INotionEndpoints['syncRecordValues']['response']>(
			'syncRecordValues',
			params,
			configs
		);
	},

	async queryCollection (params: INotionEndpoints['queryCollection']['payload'], configs?: NotionEndpointsOptions) {
		return await NotionEndpoints.Request.send<INotionEndpoints['queryCollection']['response']>(
			'queryCollection',
			params,
			configs
		);
	},

	async loadUserContent (configs?: NotionEndpointsOptions) {
		return await NotionEndpoints.Request.send<INotionEndpoints['loadUserContent']['response']>(
			'loadUserContent',
			{},
			configs
		);
	},

	async loadPageChunk (params: INotionEndpoints['loadPageChunk']['payload'], configs?: NotionEndpointsOptions) {
		return await NotionEndpoints.Request.send<INotionEndpoints['loadPageChunk']['response']>(
			'loadPageChunk',
			params,
			configs
		);
	},

	async recordPageVisit (params: INotionEndpoints['recordPageVisit']['payload'], configs?: NotionEndpointsOptions) {
		return await NotionEndpoints.Request.send<INotionEndpoints['recordPageVisit']['response']>(
			'recordPageVisit',
			params,
			configs
		);
	},

	async getJoinableSpaces (configs?: NotionEndpointsOptions) {
		return await NotionEndpoints.Request.send<INotionEndpoints['getJoinableSpaces']['response']>(
			'getJoinableSpaces',
			{},
			configs
		);
	},

	async isUserDomainJoinable (configs?: NotionEndpointsOptions) {
		return await NotionEndpoints.Request.send<INotionEndpoints['isUserDomainJoinable']['response']>(
			'isUserDomainJoinable',
			{},
			configs
		);
	},

	async isEmailEducation (configs?: NotionEndpointsOptions) {
		return await NotionEndpoints.Request.send<INotionEndpoints['isEmailEducation']['response']>(
			'isEmailEducation',
			{},
			configs
		);
	},

	async getUserNotifications (
		params: INotionEndpoints['getUserNotifications']['payload'],
		configs?: NotionEndpointsOptions
	) {
		return await NotionEndpoints.Request.send<INotionEndpoints['getUserNotifications']['response']>(
			'getUserNotifications',
			params,
			configs
		);
	},

	async getTasks (params: INotionEndpoints['getTasks']['payload'], configs?: NotionEndpointsOptions) {
		return await NotionEndpoints.Request.send<INotionEndpoints['getTasks']['response']>('getTasks', params, configs);
	}
};
