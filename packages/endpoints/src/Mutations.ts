import {
	IOperation,
	SetPageNotificationsAsReadParams,
	SetSpaceNotificationsAsReadParams,
	RemoveUsersFromSpaceParams,
	InviteGuestsToSpaceParams,
	CreateSpaceParams,
	EnqueueTaskParams,
	SetBookmarkMetadataParams,
	SaveTransactionParams,
	InitializeGoogleDriveBlockParams,
	InitializePageTemplateParams
} from '@nishans/types';
import { CtorArgs } from './types';
import {
	createSpace,
	createTransaction,
	enqueueTask,
	initializeGoogleDriveBlock,
	initializePageTemplate,
	inviteGuestsToSpace,
	removeUsersFromSpace,
	saveTransactions,
	setBookmarkMetadata,
	setPageNotificationsAsRead,
	setSpaceNotificationsAsRead
} from '../utils';
import Queries from './Queries';

export default class Mutations extends Queries {
	space_id: string;
	shard_id: number;
	createTransaction: (operations: IOperation[]) => SaveTransactionParams;

	constructor ({ cache, token, interval, user_id, shard_id, space_id }: CtorArgs) {
		super({ token, interval, user_id, cache });
		this.shard_id = shard_id;
		this.space_id = space_id;
		this.createTransaction = createTransaction.bind(this, shard_id, space_id);
	}

	async setPageNotificationsAsRead (arg: SetPageNotificationsAsReadParams) {
		return await setPageNotificationsAsRead(arg, this.getConfigs());
	}

	async setSpaceNotificationsAsRead (arg: SetSpaceNotificationsAsReadParams) {
		return await setSpaceNotificationsAsRead(arg, this.getConfigs());
	}

	async removeUsersFromSpace (arg: RemoveUsersFromSpaceParams) {
		const data = await removeUsersFromSpace(arg, this.getConfigs());
		this.saveToCache(data.recordMap);
		return data;
	}

	async inviteGuestsToSpace (arg: InviteGuestsToSpaceParams) {
		return await inviteGuestsToSpace(arg, this.getConfigs());
	}

	async createSpace (arg: CreateSpaceParams) {
		return await createSpace(arg, this.getConfigs());
	}

	async saveTransactions (Operations: IOperation[]) {
		return await saveTransactions(this.createTransaction(Operations), this.getConfigs());
	}

	async enqueueTask (params: EnqueueTaskParams) {
		return await enqueueTask(params, this.getConfigs());
	}

	async setBookmarkMetadata (arg: SetBookmarkMetadataParams) {
		return await setBookmarkMetadata(arg, this.getConfigs());
	}

	async initializeGoogleDriveBlock (arg: InitializeGoogleDriveBlockParams) {
		const data = await initializeGoogleDriveBlock(arg, this.getConfigs());
		this.saveToCache(data.recordMap.block);
		return data;
	}

	async initializePageTemplate (arg: InitializePageTemplateParams) {
		const data = await initializePageTemplate(arg, this.getConfigs());
		this.saveToCache(data.recordMap);
		return data;
	}
}
