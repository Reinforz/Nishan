import { INotionEndpoints } from '@nishans/types';
import { INotionEndpointsOptions, NotionEndpoints } from '../';

export const NotionEndpointsMutations = {
	async setPageNotificationsAsRead (
		params: INotionEndpoints['setPageNotificationsAsRead']['payload'],
		options: INotionEndpointsOptions
	) {
		return await NotionEndpoints.Request.send<INotionEndpoints['setPageNotificationsAsRead']['response']>(
			'setPageNotificationsAsRead',
			params,
			options
		);
	},
	async setSpaceNotificationsAsRead (
		params: INotionEndpoints['setSpaceNotificationsAsRead']['payload'],
		options: INotionEndpointsOptions
	) {
		return await NotionEndpoints.Request.send<INotionEndpoints['setSpaceNotificationsAsRead']['response']>(
			'setSpaceNotificationsAsRead',
			params,
			options
		);
	},
	async removeUsersFromSpace (
		params: INotionEndpoints['removeUsersFromSpace']['payload'],
		options: INotionEndpointsOptions
	) {
		return await NotionEndpoints.Request.send<INotionEndpoints['removeUsersFromSpace']['response']>(
			'removeUsersFromSpace',
			params,
			options
		);
	},
	async inviteGuestsToSpace (
		params: INotionEndpoints['inviteGuestsToSpace']['payload'],
		options: INotionEndpointsOptions
	) {
		return await NotionEndpoints.Request.send<INotionEndpoints['inviteGuestsToSpace']['response']>(
			'inviteGuestsToSpace',
			params,
			options
		);
	},
	async createSpace (params: INotionEndpoints['createSpace']['payload'], options: INotionEndpointsOptions) {
		return await NotionEndpoints.Request.send<INotionEndpoints['createSpace']['response']>(
			'createSpace',
			params,
			options
		);
	},
	async saveTransactions (params: INotionEndpoints['saveTransaction']['payload'], options: INotionEndpointsOptions) {
		return await NotionEndpoints.Request.send<INotionEndpoints['saveTransaction']['response']>(
			'saveTransactions',
			params,
			options
		);
	},
	async enqueueTask (params: INotionEndpoints['enqueueTask']['payload'], options: INotionEndpointsOptions) {
		return await NotionEndpoints.Request.send<INotionEndpoints['enqueueTask']['response']>(
			'enqueueTask',
			params,
			options
		);
	},
	async setBookmarkMetadata (
		params: INotionEndpoints['setBookmarkMetadata']['payload'],
		options: INotionEndpointsOptions
	) {
		return await NotionEndpoints.Request.send<INotionEndpoints['setBookmarkMetadata']['response']>(
			'setBookmarkMetadata',
			params,
			options
		);
	},
	async initializePageTemplate (
		params: INotionEndpoints['initializePageTemplate']['payload'],
		options: INotionEndpointsOptions
	) {
		return await NotionEndpoints.Request.send<INotionEndpoints['initializePageTemplate']['response']>(
			'initializePageTemplate',
			params,
			options
		);
	},
	async initializeGoogleDriveBlock (
		params: INotionEndpoints['initializeGoogleDriveBlock']['payload'],
		options: INotionEndpointsOptions
	) {
		return await NotionEndpoints.Request.send<INotionEndpoints['initializeGoogleDriveBlock']['response']>(
			'initializeGoogleDriveBlock',
			params,
			options
		);
	},
	async loginWithEmail (params: INotionEndpoints['loginWithEmail']['payload'], options: INotionEndpointsOptions) {
		return await NotionEndpoints.Request.send<INotionEndpoints['loginWithEmail']['response']>(
			'loginWithEmail',
			params,
			options
		);
	},
	async deleteBlocks (params: INotionEndpoints['deleteBlocks']['payload'], options: INotionEndpointsOptions) {
		return await NotionEndpoints.Request.send<INotionEndpoints['deleteBlocks']['response']>(
			'deleteBlocks',
			params,
			options
		);
	}
};
