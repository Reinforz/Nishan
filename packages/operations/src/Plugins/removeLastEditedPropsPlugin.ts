import { IOperation } from '@nishans/types';
import { NotionOperationPluginFactory } from '../';
import { PluginOptions } from './Options';

/**
 * Removes certain keys from operation args
 * @param options Options for the plugin
 */
export const removeLastEditedPropsPlugin: NotionOperationPluginFactory = (options) => {
	return (operation: IOperation) => {
		PluginOptions.skip(operation, options?.skip);
		// Deeply copy arg to remove reference in other places
		const copied_operation = JSON.parse(JSON.stringify(operation));
		const { args } = copied_operation;
		// Removes these keys from the args object if they exist
		[ 'last_edited_time', 'last_edited_by_id', 'last_edited_by_table' ].forEach(
			(prop) => (args[prop] !== undefined ? delete args[prop] : null)
		);

		// returns the newly updated operation
		return copied_operation;
	};
};
