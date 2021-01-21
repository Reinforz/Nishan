import {
	IOperation,
	SetPageNotificationsAsReadParams,
	SetSpaceNotificationsAsReadParams,
	RemoveUsersFromSpaceParams,
	RemoveUsersFromSpaceResult,
	InviteGuestsToSpaceParams,
	CreateSpaceParams,
	CreateSpaceResult,
	TEnqueueTaskParams,
	EnqueueTaskResult,
	SetBookmarkMetadataParams,
	Request
} from '@nishans/types';
import { CtorArgs } from './types';
import { createTransaction } from '../utils';
import Queries from './Queries';

export default class Mutations extends Queries {
	space_id: string;
	shard_id: number;
	createTransaction: (operations: IOperation[]) => Request;

	constructor ({ cache, token, interval, user_id, shard_id, space_id }: CtorArgs) {
		super({ token, interval, user_id, cache });
		this.shard_id = shard_id;
		this.space_id = space_id;
		this.createTransaction = createTransaction.bind(this, shard_id, space_id);
	}

	async setPageNotificationsAsRead (arg: SetPageNotificationsAsReadParams) {
		return this.returnPromise('setPageNotificationsAsRead', arg);
	}

	async setSpaceNotificationsAsRead (arg: SetSpaceNotificationsAsReadParams) {
		return this.returnPromise('setSpaceNotificationsAsRead', arg);
	}

	async removeUsersFromSpace (arg: RemoveUsersFromSpaceParams) {
		return this.returnPromise<RemoveUsersFromSpaceResult>('removeUsersFromSpace', arg, 'recordMap');
	}

	async inviteGuestsToSpace (arg: InviteGuestsToSpaceParams) {
		return this.returnPromise('inviteGuestsToSpace', arg);
	}

	async createSpace (arg: Partial<CreateSpaceParams>): Promise<CreateSpaceResult> {
		return this.returnPromise<CreateSpaceResult>(
			'createSpace',
			{
				...arg,
				planType: 'personal',
				initialUseCases: []
			},
			'recordMap'
		);
	}

	async saveTransactions (Operations: IOperation[]) {
		return this.returnPromise('saveTransactions', this.createTransaction(Operations));
	}

	// ? TD:2:M Add task typedef
	// ? TD:2:M Add EnqueueTaskResult interface
	async enqueueTask (task: TEnqueueTaskParams) {
		return this.returnPromise<EnqueueTaskResult>('enqueueTask', task);
	}

	async setBookmarkMetadata (arg: SetBookmarkMetadataParams) {
		return this.returnPromise('setBookmarkMetadata', arg);
	}
}
