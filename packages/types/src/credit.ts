export type TCreditType =
	| 'import_evernote'
	| 'invited_user'
	| 'web_login'
	| 'desktop_login'
	| 'mobile_login'
	| 'browser_extension';

export interface ICredit {
	activated: boolean;
	amount: number;
	created_timestamp: string;
	id: string;
	type: TCreditType;
	user_id: string;
	version: number;
}

interface GCredit<A extends number, T extends TCreditType> extends ICredit {
	type: T;
	amount: A;
}

export interface ImportEvernoteCredit extends GCredit<500, 'import_evernote'> {}
export interface InvitedUserCredit extends GCredit<500, 'invited_user'> {
	to_user_id: string;
	sent_email: boolean;
}

export interface WebLoginCredit extends GCredit<500, 'web_login'> {}
export interface DesktopLoginCredit extends GCredit<500, 'desktop_login'> {}
export interface MobileLoginCredit extends GCredit<500, 'mobile_login'> {}
export interface BrowserExtensionCredit extends GCredit<300, 'browser_extension'> {}

export type TCredit =
	| ImportEvernoteCredit
	| InvitedUserCredit
	| WebLoginCredit
	| DesktopLoginCredit
	| MobileLoginCredit
	| BrowserExtensionCredit;
