import { IOperation } from '@nishans/types';
import { NotionOperationPluginFactory } from '../';

export const removeEmptyOperationsPlugin: NotionOperationPluginFactory = () => {
	return (operation: IOperation) => {
		const { args } = JSON.parse(JSON.stringify(operation));
		const arg_keys = Object.keys(args);
		if (arg_keys.length === 0) return false;
		else return operation;
	};
};
