import { TDataType } from '@nishans/types';
import colors from 'colors';

/**
 * Thrown when a data doesn't exist in cache or from a response
 */
export class NonExistentData extends Error {
	// An array of property types to be expected
	constructor (data_type: TDataType, id: string) {
		super(colors.bold.red(`${data_type}:${id} doesn't exist`));
	}
}
