import {
	CreateSpaceParams,
	CreateSpaceResult,
	EnqueueTaskParams,
	EnqueueTaskResult,
	InitializeGoogleDriveBlockParams,
	InitializeGoogleDriveBlockResult,
	InitializePageTemplateParams,
	InitializePageTemplateResult,
	InviteGuestsToSpaceParams,
	LoginWithEmailParams,
	LoginWithEmailResult,
	RemoveUsersFromSpaceParams,
	RemoveUsersFromSpaceResult,
	SaveTransactionParams,
	SetBookmarkMetadataParams,
	SetPageNotificationsAsReadParams,
	SetSpaceNotificationsAsReadParams
} from '@nishans/types';
import { NotionRequestConfigs } from '.';
import { NotionRequest } from '../utils';

const Mutations = {
	async setPageNotificationsAsRead (params: SetPageNotificationsAsReadParams, configs: NotionRequestConfigs) {
		return await NotionRequest.send('setPageNotificationsAsRead', params, configs);
	},
	async setSpaceNotificationsAsRead (params: SetSpaceNotificationsAsReadParams, configs: NotionRequestConfigs) {
		return await NotionRequest.send('setSpaceNotificationsAsRead', params, configs);
	},
	async removeUsersFromSpace (params: RemoveUsersFromSpaceParams, configs: NotionRequestConfigs) {
		return await NotionRequest.send<RemoveUsersFromSpaceResult>('removeUsersFromSpace', params, configs);
	},
	async inviteGuestsToSpace (params: InviteGuestsToSpaceParams, configs: NotionRequestConfigs) {
		return await NotionRequest.send('inviteGuestsToSpace', params, configs);
	},
	async createSpace (params: CreateSpaceParams, configs: NotionRequestConfigs) {
		return await NotionRequest.send<CreateSpaceResult>('createSpace', params, configs);
	},
	async saveTransactions (params: SaveTransactionParams, configs: NotionRequestConfigs) {
		return await NotionRequest.send('saveTransactions', params, configs);
	},
	async enqueueTask (params: EnqueueTaskParams, configs: NotionRequestConfigs) {
		return await NotionRequest.send<EnqueueTaskResult>('enqueueTask', params, configs);
	},
	async setBookmarkMetadata (params: SetBookmarkMetadataParams, configs: NotionRequestConfigs) {
		return await NotionRequest.send('setBookmarkMetadata', params, configs);
	},
	async initializePageTemplate (params: InitializePageTemplateParams, configs: NotionRequestConfigs) {
		return await NotionRequest.send<InitializePageTemplateResult>('initializePageTemplate', params, configs);
	},
	async initializeGoogleDriveBlock (params: InitializeGoogleDriveBlockParams, configs: NotionRequestConfigs) {
		return await NotionRequest.send<InitializeGoogleDriveBlockResult>('initializeGoogleDriveBlock', params, configs);
	},
	async loginWithEmail (params: LoginWithEmailParams, configs: NotionRequestConfigs) {
		return await NotionRequest.send<LoginWithEmailResult>('loginWithEmail', params, configs);
	}
};

export default Mutations;
