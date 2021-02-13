import { TDataType } from '@nishans/types';

export type UpdateCacheManuallyParam = [string, TDataType][];

export interface NotionHeaders {
	headers: {
		cookie: string;
		['x-notion-active-user-header']: string;
	};
}

export interface NotionRequestConfigs {
	token: string;
	user_id?: string;
	interval?: number;
}
