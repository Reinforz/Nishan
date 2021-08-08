import { INotionData } from '.';

export type TNotificationChannel = 'mentions' | 'following' | 'archive';

interface INotification<T, C> {
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
	channel: C;
}

export interface IEmailEditedNotification extends INotification<'email-edited', 'following'> {}
export interface IBlockEditedNotification extends INotification<'block-edited', 'following'> {
	navigable_block_id: string;
}
export interface IPermissionEditedNotification extends INotification<'permission-edited', 'following'> {}
export interface ICommentedNotification extends INotification<'commented', 'mentions'> {
	navigable_block_id: string;
}
export interface ITopLevelBlockDeletedNotification extends INotification<'top-level-block-deleted', 'following'> {}
export interface ITopLevelBlockCreatedNotification extends INotification<'top-level-block-created', 'following'> {}
export interface ICollectionViewCreatedNotification extends INotification<'collection-view-created', 'following'> {}
export interface ICollectionRowCreatedNotification extends INotification<'collection-row-created', 'following'> {}
export interface UserInvitedNotification extends INotification<'user-invited', 'mentions'> {
	navigable_block_id: string;
}
export interface UserMentionedNotification extends INotification<'user-mentioned', 'mentions'> {
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
	| ICollectionRowCreatedNotification
	| UserMentionedNotification;

export type INotificationData = INotionData<TNotification>;
