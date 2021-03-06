import { TSchemaUnitType } from '@nishans/types';
import colors from 'colors';

/**
 * A notion specific error class, that is thrown when a schema doesn't contain a specific type of property
 */
export class NonExistentSchemaUnitType extends Error {
	// An array of property types to be expected
	constructor (expected_types: TSchemaUnitType[]) {
		super(colors.bold.red(`Schema doesn't contain any property of type ${expected_types.join(' | ')}`));
	}
}
