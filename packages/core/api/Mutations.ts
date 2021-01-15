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

import { Queries } from '@nishans/endpoints';
import { NishanArg } from '../types';
import { createTransaction } from '../utils';

export default class Mutations extends Queries {
	protected space_id: string;
	protected shard_id: number;
	protected createTransaction: (operations: IOperation[]) => Request;

	constructor ({ cache, token, interval, logger, user_id, shard_id, space_id }: NishanArg) {
		super({ token, interval, user_id, cache });
		this.shard_id = shard_id;
		this.space_id = space_id;
		this.createTransaction = createTransaction.bind(this, shard_id, space_id);
	}

	protected async setPageNotificationsAsRead (arg: SetPageNotificationsAsReadParams) {
		return this.returnPromise('setPageNotificationsAsRead', arg);
	}

	protected async setSpaceNotificationsAsRead (arg: SetSpaceNotificationsAsReadParams) {
		return this.returnPromise('setSpaceNotificationsAsRead', arg);
	}

	protected async removeUsersFromSpace (arg: RemoveUsersFromSpaceParams) {
		return this.returnPromise<RemoveUsersFromSpaceResult>('removeUsersFromSpace', arg, 'recordMap');
	}

	protected async inviteGuestsToSpace (arg: InviteGuestsToSpaceParams) {
		return this.returnPromise('inviteGuestsToSpace', arg);
	}

	protected async createSpace (arg: Partial<CreateSpaceParams>): Promise<CreateSpaceResult> {
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

	protected async saveTransactions (Operations: IOperation[]) {
		return this.returnPromise('saveTransactions', this.createTransaction(Operations));
	}

	// ? TD:2:M Add task typedef
	// ? TD:2:M Add EnqueueTaskResult interface
	protected async enqueueTask (task: TEnqueueTaskParams) {
		return this.returnPromise<EnqueueTaskResult>('enqueueTask', task);
	}

	protected async setBookmarkMetadata (arg: SetBookmarkMetadataParams) {
		return this.returnPromise('setBookmarkMetadata', arg);
	}
}
