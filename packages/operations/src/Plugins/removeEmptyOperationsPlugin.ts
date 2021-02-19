import { IOperation } from '@nishans/types';
import { NotionOperationPluginFactory } from '../';
import { skipOption } from './utils';

export const removeEmptyOperationsPlugin: NotionOperationPluginFactory = (options) => {
	return (operation: IOperation) => {
		skipOption(options, operation);
		const { args } = JSON.parse(JSON.stringify(operation));
		const arg_keys = Object.keys(args);
		if (arg_keys.length === 0) return false;
		else return operation;
	};
};
