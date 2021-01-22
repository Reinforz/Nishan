import {
	SetPageNotificationsAsReadParams,
	SetSpaceNotificationsAsReadParams,
	RemoveUsersFromSpaceParams,
	RemoveUsersFromSpaceResult,
	InviteGuestsToSpaceParams,
	CreateSpaceParams,
	CreateSpaceResult,
	SaveTransactionParams,
	TEnqueueTaskParams,
	EnqueueTaskResult,
	SetBookmarkMetadataParams,
	InitializePageTemplateResult,
	InitializePageTemplateParams,
	InitializeGoogleDriveBlockParams,
	InitializeGoogleDriveBlockResult
} from '@nishans/types';

import { Configs, ConfigsWithoutUserid } from '../src';
import { sendRequest } from './';

export async function setPageNotificationsAsRead (
	params: SetPageNotificationsAsReadParams,
	configs: ConfigsWithoutUserid
) {
	await sendRequest('setPageNotificationsAsRead', params, configs);
}

export async function setSpaceNotificationsAsRead (
	params: SetSpaceNotificationsAsReadParams,
	configs: ConfigsWithoutUserid
) {
	await sendRequest('setSpaceNotificationsAsRead', params, configs);
}

export async function removeUsersFromSpace (params: RemoveUsersFromSpaceParams, configs: ConfigsWithoutUserid) {
	return await sendRequest<RemoveUsersFromSpaceResult>('removeUsersFromSpace', params, configs);
}

export async function inviteGuestsToSpace (params: InviteGuestsToSpaceParams, configs: ConfigsWithoutUserid) {
	return await sendRequest('inviteGuestsToSpace', params, configs);
}

export async function createSpace (params: CreateSpaceParams, configs: Configs) {
	return await sendRequest<CreateSpaceResult>('createSpace', params, configs);
}

export async function saveTransactions (params: SaveTransactionParams, configs: Configs) {
	await sendRequest('saveTransactions', params, configs);
}

export async function enqueueTask (params: TEnqueueTaskParams, configs: Configs) {
	return await sendRequest<EnqueueTaskResult>('enqueueTask', params, configs);
}

export async function setBookmarkMetadata (params: SetBookmarkMetadataParams, configs: Configs) {
	return await sendRequest('setBookmarkMetadata', params, configs);
}

export async function initializePageTemplate (params: InitializePageTemplateParams, configs: Configs) {
	return await sendRequest<InitializePageTemplateResult>('initializePageTemplate', params, configs);
}

export async function initializeGoogleDriveBlock (
	params: InitializeGoogleDriveBlockParams,
	configs: ConfigsWithoutUserid
) {
	return await sendRequest<InitializeGoogleDriveBlockResult>('initializeGoogleDriveBlock', params, configs);
}
