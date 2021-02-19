import { IOperation } from '@nishans/types';

export interface CommonPluginOptions {
	skip?: (operation: IOperation) => boolean;
}

export type NotionOperationPluginFactory<T extends CommonPluginOptions = CommonPluginOptions> = (
	options?: T
) => NotionOperationPluginFunction;
export type NotionOperationPluginFunction = (operation: IOperation) => false | IOperation;
