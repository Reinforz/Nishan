import { IOperation } from '@nishans/types';
import { NotionOperationPlugin } from '../';

export const removeLastEditedPropsPlugin: NotionOperationPlugin = (operation: IOperation) => {
	const copied_operation = JSON.parse(JSON.stringify(operation));
	const { args } = copied_operation;

	[ 'last_edited_time', 'last_edited_by_id', 'last_edited_by_table' ].forEach(
		(prop) => (args[prop] !== undefined ? delete args[prop] : null)
	);
	return copied_operation;
};
