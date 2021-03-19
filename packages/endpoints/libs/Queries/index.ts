import { INotionEndpoints } from '@nishans/types';
import { INotionEndpointsOptions, NotionEndpoints } from '../';

export const NotionEndpointsQueries = {
	async ping (options?: INotionEndpointsOptions) {
		return await NotionEndpoints.Request.send<Record<string, never>>('ping', {}, options);
	},

	async getAvailableCountries (options?: INotionEndpointsOptions) {
		return await NotionEndpoints.Request.send<INotionEndpoints['getAvailableCountries']['response']>(
			'getAvailableCountries',
			{},
			options
		);
	},

	async checkEmailType (params: INotionEndpoints['checkEmailType']['payload'], options?: INotionEndpointsOptions) {
		return await NotionEndpoints.Request.send<INotionEndpoints['checkEmailType']['response']>(
			'checkEmailType',
			params,
			options
		);
	},

	async getCsatMilestones (
		params: INotionEndpoints['getCsatMilestones']['payload'],
		options?: INotionEndpointsOptions
	) {
		return await NotionEndpoints.Request.send<INotionEndpoints['getCsatMilestones']['response']>(
			'getCsatMilestones',
			params,
			options
		);
	},

	async getActivityLog (params: INotionEndpoints['getActivityLog']['payload'], options?: INotionEndpointsOptions) {
		return await NotionEndpoints.Request.send<INotionEndpoints['getActivityLog']['response']>(
			'getActivityLog',
			params,
			options
		);
	},

	async getAssetsJsonV2 (params: INotionEndpoints['getAssetsJsonV2']['payload'], options?: INotionEndpointsOptions) {
		return await NotionEndpoints.Request.send<INotionEndpoints['getAssetsJsonV2']['response']>(
			'getAssetsJsonV2',
			params,
			options
		);
	},

	async getUserAnalyticsSettings (
		params: INotionEndpoints['getUserAnalyticsSettings']['payload'],
		options?: INotionEndpointsOptions
	) {
		return await NotionEndpoints.Request.send<INotionEndpoints['getUserAnalyticsSettings']['response']>(
			'getUserAnalyticsSettings',
			params,
			options
		);
	},

	async getClientExperiments (
		params: INotionEndpoints['getClientExperiments']['payload'],
		options?: INotionEndpointsOptions
	) {
		return await NotionEndpoints.Request.send<INotionEndpoints['getClientExperiments']['response']>(
			'getClientExperiments',
			params,
			options
		);
	},

	async getPageVisits (params: INotionEndpoints['getPageVisits']['payload'], options?: INotionEndpointsOptions) {
		return await NotionEndpoints.Request.send<INotionEndpoints['getPageVisits']['response']>(
			'getPageVisits',
			params,
			options
		);
	},

	async getUserSharedPages (
		params: INotionEndpoints['getUserSharedPages']['payload'],
		options?: INotionEndpointsOptions
	) {
		return await NotionEndpoints.Request.send<INotionEndpoints['getUserSharedPages']['response']>(
			'getUserSharedPages',
			params,
			options
		);
	},

	async getUserSharedPagesInSpace (
		params: INotionEndpoints['getUserSharedPagesInSpace']['payload'],
		options?: INotionEndpointsOptions
	) {
		return await NotionEndpoints.Request.send<INotionEndpoints['getUserSharedPagesInSpace']['response']>(
			'getUserSharedPagesInSpace',
			params,
			options
		);
	},

	async getUserTasks (options?: INotionEndpointsOptions) {
		return await NotionEndpoints.Request.send<INotionEndpoints['getUserTasks']['response']>(
			'getUserTasks',
			{},
			options
		);
	},

	async search (params: INotionEndpoints['search']['payload'], options?: INotionEndpointsOptions) {
		return await NotionEndpoints.Request.send<INotionEndpoints['search']['response']>('search', params, options);
	},

	async getPublicPageData (
		params: INotionEndpoints['getPublicPageData']['payload'],
		options?: INotionEndpointsOptions
	) {
		return await NotionEndpoints.Request.send<INotionEndpoints['getPublicPageData']['response']>(
			'getPublicPageData',
			params,
			options
		);
	},

	async getPublicSpaceData (
		params: INotionEndpoints['getPublicSpaceData']['payload'],
		options?: INotionEndpointsOptions
	) {
		return await NotionEndpoints.Request.send<INotionEndpoints['getPublicSpaceData']['response']>(
			'getPublicSpaceData',
			params,
			options
		);
	},

	async getSubscriptionData (
		params: INotionEndpoints['getSubscriptionData']['payload'],
		options?: INotionEndpointsOptions
	) {
		return await NotionEndpoints.Request.send<INotionEndpoints['getSubscriptionData']['response']>(
			'getSubscriptionData',
			params,
			options
		);
	},

	async loadBlockSubtree (params: INotionEndpoints['loadBlockSubtree']['payload'], options?: INotionEndpointsOptions) {
		return await NotionEndpoints.Request.send<INotionEndpoints['loadBlockSubtree']['response']>(
			'loadBlockSubtree',
			params,
			options
		);
	},

	async getSpaces (options?: INotionEndpointsOptions) {
		return await NotionEndpoints.Request.send<INotionEndpoints['getSpaces']['response']>('getSpaces', {}, options);
	},

	async getGenericEmbedBlockData (
		params: INotionEndpoints['getGenericEmbedBlockData']['payload'],
		options?: INotionEndpointsOptions
	) {
		return await NotionEndpoints.Request.send<INotionEndpoints['getGenericEmbedBlockData']['response']>(
			'getGenericEmbedBlockData',
			params,
			options
		);
	},

	async getUploadFileUrl (params: INotionEndpoints['getUploadFileUrl']['payload'], options?: INotionEndpointsOptions) {
		return await NotionEndpoints.Request.send<INotionEndpoints['getUploadFileUrl']['response']>(
			'getUploadFileUrl',
			params,
			options
		);
	},

	async getGoogleDriveAccounts (options?: INotionEndpointsOptions) {
		return await NotionEndpoints.Request.send<INotionEndpoints['getGoogleDriveAccounts']['response']>(
			'getGoogleDriveAccounts',
			{},
			options
		);
	},

	async getBacklinksForBlock (
		params: INotionEndpoints['getBacklinksForBlock']['payload'],
		options?: INotionEndpointsOptions
	) {
		return await NotionEndpoints.Request.send<INotionEndpoints['getBacklinksForBlock']['response']>(
			'getBacklinksForBlock',
			params,
			options
		);
	},

	async findUser (params: INotionEndpoints['findUser']['payload'], options?: INotionEndpointsOptions) {
		return await NotionEndpoints.Request.send<INotionEndpoints['findUser']['response']>('findUser', params, options);
	},

	async syncRecordValues (params: INotionEndpoints['syncRecordValues']['payload'], options?: INotionEndpointsOptions) {
		return await NotionEndpoints.Request.send<INotionEndpoints['syncRecordValues']['response']>(
			'syncRecordValues',
			params,
			options
		);
	},

	async getRecordValues (params: INotionEndpoints['getRecordValues']['payload'], options?: INotionEndpointsOptions) {
		return await NotionEndpoints.Request.send<INotionEndpoints['getRecordValues']['response']>(
			'getRecordValues',
			params,
			options
		);
	},

	async queryCollection (params: INotionEndpoints['queryCollection']['payload'], options?: INotionEndpointsOptions) {
		return await NotionEndpoints.Request.send<INotionEndpoints['queryCollection']['response']>(
			'queryCollection',
			params,
			options
		);
	},

	async loadUserContent (options?: INotionEndpointsOptions) {
		return await NotionEndpoints.Request.send<INotionEndpoints['loadUserContent']['response']>(
			'loadUserContent',
			{},
			options
		);
	},

	async loadPageChunk (params: INotionEndpoints['loadPageChunk']['payload'], options?: INotionEndpointsOptions) {
		return await NotionEndpoints.Request.send<INotionEndpoints['loadPageChunk']['response']>(
			'loadPageChunk',
			params,
			options
		);
	},

	async recordPageVisit (params: INotionEndpoints['recordPageVisit']['payload'], options?: INotionEndpointsOptions) {
		return await NotionEndpoints.Request.send<INotionEndpoints['recordPageVisit']['response']>(
			'recordPageVisit',
			params,
			options
		);
	},

	async getJoinableSpaces (options?: INotionEndpointsOptions) {
		return await NotionEndpoints.Request.send<INotionEndpoints['getJoinableSpaces']['response']>(
			'getJoinableSpaces',
			{},
			options
		);
	},

	async isUserDomainJoinable (options?: INotionEndpointsOptions) {
		return await NotionEndpoints.Request.send<INotionEndpoints['isUserDomainJoinable']['response']>(
			'isUserDomainJoinable',
			{},
			options
		);
	},

	async isEmailEducation (options?: INotionEndpointsOptions) {
		return await NotionEndpoints.Request.send<INotionEndpoints['isEmailEducation']['response']>(
			'isEmailEducation',
			{},
			options
		);
	},

	async getUserNotifications (
		params: INotionEndpoints['getUserNotifications']['payload'],
		options?: INotionEndpointsOptions
	) {
		return await NotionEndpoints.Request.send<INotionEndpoints['getUserNotifications']['response']>(
			'getUserNotifications',
			params,
			options
		);
	},

	async getTasks (params: INotionEndpoints['getTasks']['payload'], options?: INotionEndpointsOptions) {
		return await NotionEndpoints.Request.send<INotionEndpoints['getTasks']['response']>('getTasks', params, options);
	}
};
