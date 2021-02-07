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

import { Configs } from '../src';
import { sendRequest } from './';

export async function setPageNotificationsAsRead (
	params: SetPageNotificationsAsReadParams,
	configs?: Partial<Configs>
) {
	return await sendRequest('setPageNotificationsAsRead', params, configs);
}

export async function setSpaceNotificationsAsRead (
	params: SetSpaceNotificationsAsReadParams,
	configs?: Partial<Configs>
) {
	return await sendRequest('setSpaceNotificationsAsRead', params, configs);
}

export async function removeUsersFromSpace (params: RemoveUsersFromSpaceParams, configs?: Partial<Configs>) {
	return await sendRequest<RemoveUsersFromSpaceResult>('removeUsersFromSpace', params, configs);
}

export async function inviteGuestsToSpace (params: InviteGuestsToSpaceParams, configs?: Partial<Configs>) {
	return await sendRequest('inviteGuestsToSpace', params, configs);
}

export async function createSpace (params: CreateSpaceParams, configs?: Partial<Configs>) {
	return await sendRequest<CreateSpaceResult>('createSpace', params, configs);
}

export async function saveTransactions (params: SaveTransactionParams, configs?: Partial<Configs>) {
	return await sendRequest('saveTransactions', params, configs);
}

export async function enqueueTask (params: EnqueueTaskParams, configs?: Partial<Configs>) {
	return await sendRequest<EnqueueTaskResult>('enqueueTask', params, configs);
}

export async function setBookmarkMetadata (params: SetBookmarkMetadataParams, configs?: Partial<Configs>) {
	return await sendRequest('setBookmarkMetadata', params, configs);
}

export async function initializePageTemplate (params: InitializePageTemplateParams, configs?: Partial<Configs>) {
	return await sendRequest<InitializePageTemplateResult>('initializePageTemplate', params, configs);
}

export async function initializeGoogleDriveBlock (
	params: InitializeGoogleDriveBlockParams,
	configs?: Partial<Configs>
) {
	return await sendRequest<InitializeGoogleDriveBlockResult>('initializeGoogleDriveBlock', params, configs);
}
