import { IOperation } from '@nishans/types';
import { NotionOperationPlugin } from '../';

export const removeLastEditedPropsPlugin: NotionOperationPlugin = (operation: IOperation) => {
	const { args } = JSON.parse(JSON.stringify(operation));
	[ 'last_edited_time', 'last_edited_by_id', 'last_edited_table' ].forEach((prop) => args[prop] && delete args[prop]);
	return operation;
};
