import { removeEmptyOperationsPlugin } from './removeEmptyOperationsPlugin';
import { removeLastEditedPropsPlugin } from './removeLastEditedPropsPlugin';
import { validateOperationsPlugin } from './validateOperationsPlugin';

export const Plugin = {
	validateOperations: validateOperationsPlugin,
	removeLastEditedProps: removeLastEditedPropsPlugin,
	removeEmptyOperations: removeEmptyOperationsPlugin
};
