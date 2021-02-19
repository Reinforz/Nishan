import { removeEmptyOperationsPlugin } from './removeEmptyOperationsPlugin';
import { removeLastEditedPropsPlugin } from './removeLastEditedPropsPlugin';
import { validateOperationsPlugin } from './validateOperationsPlugin';

export const NotionOperationsPlugin = {
	validateOperations: validateOperationsPlugin,
	removeLastEditedProps: removeLastEditedPropsPlugin,
	removeEmptyOperations: removeEmptyOperationsPlugin
};
