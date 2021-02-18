import { IOperation } from '@nishans/types';

export type NotionOperationPluginFactory<T = unknown> = (options?: T) => NotionOperationPluginFunction;
export type NotionOperationPluginFunction = (operation: IOperation) => false | IOperation;
