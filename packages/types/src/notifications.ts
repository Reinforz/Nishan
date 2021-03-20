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

export interface EmailEditedNotification extends INotification<'email-edited'> {}
export interface UserInvitedNotification extends INotification<'user-invited'> {
	navigable_block_id: string;
}

export type INotificationData = INotionData<UserInvitedNotification | EmailEditedNotification>;
