import { IOperation } from '@nishans/types';

export type NotionOperationPlugin = (operation: IOperation) => false | IOperation;
