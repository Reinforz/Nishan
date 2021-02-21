import { TDataType } from '@nishans/types';

/**
 * Thrown when a data doesn't exist in cache or from a response
 */
export class NonExistentDataError extends Error {
	// An array of property types to be expected
	constructor (data_type: TDataType, id: string) {
		super(`${data_type}:${id} doesn't exist`);
	}
}
