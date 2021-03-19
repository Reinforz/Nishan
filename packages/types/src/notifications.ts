import { TPermissionRole } from './permissions';

interface INotification<T> {
	[k: string]: {
		role: TPermissionRole;
		value: {
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
		};
	};
}

export interface EmailEditedNotification extends INotification<'email-edited'> {}

export type TNotification = EmailEditedNotification;
