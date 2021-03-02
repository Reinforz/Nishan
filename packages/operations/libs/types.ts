import { NotionRequestConfigs } from '@nishans/endpoints';
import { IOperation } from '@nishans/types';

export interface CommonPluginOptions {
	skip?: (operation: IOperation) => boolean;
}

export type NotionOperationPluginFactory<T extends CommonPluginOptions = CommonPluginOptions> = (
	options?: T
) => NotionOperationPluginFunction;
export type NotionOperationPluginFunction = (operation: IOperation) => false | IOperation;

export type NotionOperationOptions = NotionRequestConfigs & {
	notion_operation_plugins?: NotionOperationPluginFunction[];
	shard_id: number;
	space_id: string;
};
