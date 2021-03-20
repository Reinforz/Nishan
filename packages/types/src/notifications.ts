import { INotionData } from '.';

interface INotification<T> {
	id: string;
	version: number;
	user_id: string;
	activity_id: string;
	received: boolean;
	read: boolean;
	emailed: boolean;
	invalid: boolean;
	visited: boolean;
	space_id: string;
	end_time: string;
	type: T;
	channel: 'mentions';
}

export interface IEmailEditedNotification extends INotification<'email-edited'> {}
export interface IBlockEditedNotification extends INotification<'block-edited'> {}
export interface IPermissionEditedNotification extends INotification<'permission-edited'> {}
export interface ICommentedNotification extends INotification<'commented'> {}
export interface ITopLevelBlockDeletedNotification extends INotification<'top-level-block-deleted'> {}
export interface ITopLevelBlockCreatedNotification extends INotification<'top-level-block-created'> {}
export interface ICollectionViewCreatedNotification extends INotification<'collection-view-created'> {}
export interface ICollectionRowCreatedNotification extends INotification<'collection-row-created'> {}
export interface UserInvitedNotification extends INotification<'user-invited'> {
	navigable_block_id: string;
}

export type TNotification =
	| IEmailEditedNotification
	| IBlockEditedNotification
	| IPermissionEditedNotification
	| ICommentedNotification
	| ITopLevelBlockDeletedNotification
	| ITopLevelBlockCreatedNotification
	| ICollectionViewCreatedNotification
	| ICollectionRowCreatedNotification;

export type INotificationData = INotionData<TNotification>;
