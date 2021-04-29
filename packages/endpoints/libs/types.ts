import { TDataType } from '@nishans/types';

export type SyncRecordValuesTuple = [string, TDataType][];

export interface NotionHeaders {
  headers: {
    cookie: string;
    ['x-notion-active-user-header']: string;
  };
}

export interface INotionEndpointsOptions {
  token: string;
  user_id: string;
  interval?: number;
  logger?: boolean;
}
