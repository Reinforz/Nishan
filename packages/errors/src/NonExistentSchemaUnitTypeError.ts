import { TSchemaUnitType } from '@nishans/types';

/**
 * A notion specific error class, that is thrown when a schema doesn't contain a specific type of property
 */
export class NonExistentSchemaUnitTypeError extends Error {
	// An array of property types to be expected
	constructor (expected_types: TSchemaUnitType[]) {
		super(`Schema doesn't contain any property of type ${expected_types.join(' | ')}`);
	}
}
