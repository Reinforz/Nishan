import { TDataType } from './types';

export type TOperationCommand =
  | 'set'
  | 'update'
  | 'keyedObjectListAfter'
  | 'keyedObjectListUpdate'
  | 'listAfter'
  | 'listRemove'
  | 'listBefore'
  | 'setPermissionItem';

export interface Transaction {
  id: string;
  spaceId: string;
  operations: IOperation[];
}

export interface IPointer {
  table: TDataType;
  id: string;
  spaceId: string;
}
export interface IOperation {
  pointer: IPointer;
  command: TOperationCommand;
  path: string[];
  args: any;
}
