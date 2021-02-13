import {
	SetPageNotificationsAsReadParams,
	SetSpaceNotificationsAsReadParams,
	RemoveUsersFromSpaceParams,
	RemoveUsersFromSpaceResult,
	InviteGuestsToSpaceParams,
	CreateSpaceParams,
	CreateSpaceResult,
	SaveTransactionParams,
	EnqueueTaskParams,
	EnqueueTaskResult,
	SetBookmarkMetadataParams,
	InitializePageTemplateResult,
	InitializePageTemplateParams,
	InitializeGoogleDriveBlockParams,
	InitializeGoogleDriveBlockResult
} from '@nishans/types';

import { Configs } from '.';
import { sendRequest } from '../utils';

const Mutations = {
	async setPageNotificationsAsRead (params: SetPageNotificationsAsReadParams, configs?: Partial<Configs>) {
		return await sendRequest('setPageNotificationsAsRead', params, configs);
	},
	async setSpaceNotificationsAsRead (params: SetSpaceNotificationsAsReadParams, configs?: Partial<Configs>) {
		return await sendRequest('setSpaceNotificationsAsRead', params, configs);
	},
	async removeUsersFromSpace (params: RemoveUsersFromSpaceParams, configs?: Partial<Configs>) {
		return await sendRequest<RemoveUsersFromSpaceResult>('removeUsersFromSpace', params, configs);
	},
	async inviteGuestsToSpace (params: InviteGuestsToSpaceParams, configs?: Partial<Configs>) {
		return await sendRequest('inviteGuestsToSpace', params, configs);
	},
	async createSpace (params: CreateSpaceParams, configs?: Partial<Configs>) {
		return await sendRequest<CreateSpaceResult>('createSpace', params, configs);
	},
	async saveTransactions (params: SaveTransactionParams, configs?: Partial<Configs>) {
		return await sendRequest('saveTransactions', params, configs);
	},
	async enqueueTask (params: EnqueueTaskParams, configs?: Partial<Configs>) {
		return await sendRequest<EnqueueTaskResult>('enqueueTask', params, configs);
	},
	async setBookmarkMetadata (params: SetBookmarkMetadataParams, configs?: Partial<Configs>) {
		return await sendRequest('setBookmarkMetadata', params, configs);
	},
	async initializePageTemplate (params: InitializePageTemplateParams, configs?: Partial<Configs>) {
		return await sendRequest<InitializePageTemplateResult>('initializePageTemplate', params, configs);
	},
	async initializeGoogleDriveBlock (params: InitializeGoogleDriveBlockParams, configs?: Partial<Configs>) {
		return await sendRequest<InitializeGoogleDriveBlockResult>('initializeGoogleDriveBlock', params, configs);
	}
};

export default Mutations;
