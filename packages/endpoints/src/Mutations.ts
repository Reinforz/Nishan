import { NotionEndpoints } from '@nishans/types';
import { NotionRequestConfigs } from '.';
import { NotionRequest } from '../utils';

const Mutations = {
	async setPageNotificationsAsRead (
		params: NotionEndpoints['setPageNotificationsAsRead']['payload'],
		configs: NotionRequestConfigs
	) {
		return await NotionRequest.send<NotionEndpoints['setPageNotificationsAsRead']['response']>(
			'setPageNotificationsAsRead',
			params,
			configs
		);
	},
	async setSpaceNotificationsAsRead (
		params: NotionEndpoints['setSpaceNotificationsAsRead']['payload'],
		configs: NotionRequestConfigs
	) {
		return await NotionRequest.send<NotionEndpoints['setSpaceNotificationsAsRead']['response']>(
			'setSpaceNotificationsAsRead',
			params,
			configs
		);
	},
	async removeUsersFromSpace (
		params: NotionEndpoints['removeUsersFromSpace']['payload'],
		configs: NotionRequestConfigs
	) {
		return await NotionRequest.send<NotionEndpoints['removeUsersFromSpace']['response']>(
			'removeUsersFromSpace',
			params,
			configs
		);
	},
	async inviteGuestsToSpace (params: NotionEndpoints['inviteGuestsToSpace']['payload'], configs: NotionRequestConfigs) {
		return await NotionRequest.send<NotionEndpoints['inviteGuestsToSpace']['response']>(
			'inviteGuestsToSpace',
			params,
			configs
		);
	},
	async createSpace (params: NotionEndpoints['createSpace']['payload'], configs: NotionRequestConfigs) {
		return await NotionRequest.send<NotionEndpoints['createSpace']['response']>('createSpace', params, configs);
	},
	async saveTransactions (params: NotionEndpoints['saveTransaction']['payload'], configs: NotionRequestConfigs) {
		return await NotionRequest.send<NotionEndpoints['saveTransaction']['response']>(
			'saveTransactions',
			params,
			configs
		);
	},
	async enqueueTask (params: NotionEndpoints['enqueueTask']['payload'], configs: NotionRequestConfigs) {
		return await NotionRequest.send<NotionEndpoints['enqueueTask']['response']>('enqueueTask', params, configs);
	},
	async setBookmarkMetadata (params: NotionEndpoints['setBookmarkMetadata']['payload'], configs: NotionRequestConfigs) {
		return await NotionRequest.send<NotionEndpoints['setBookmarkMetadata']['response']>(
			'setBookmarkMetadata',
			params,
			configs
		);
	},
	async initializePageTemplate (
		params: NotionEndpoints['initializePageTemplate']['payload'],
		configs: NotionRequestConfigs
	) {
		return await NotionRequest.send<NotionEndpoints['initializePageTemplate']['response']>(
			'initializePageTemplate',
			params,
			configs
		);
	},
	async initializeGoogleDriveBlock (
		params: NotionEndpoints['initializeGoogleDriveBlock']['payload'],
		configs: NotionRequestConfigs
	) {
		return await NotionRequest.send<NotionEndpoints['initializeGoogleDriveBlock']['response']>(
			'initializeGoogleDriveBlock',
			params,
			configs
		);
	},
	async loginWithEmail (params: NotionEndpoints['loginWithEmail']['payload'], configs: NotionRequestConfigs) {
		return await NotionRequest.send<NotionEndpoints['loginWithEmail']['response']>('loginWithEmail', params, configs);
	}
};

export default Mutations;
