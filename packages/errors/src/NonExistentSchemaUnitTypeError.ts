import { TSchemaUnitType } from '@nishans/types';

export class NonExistentSchemaUnitTypeError extends Error {
	constructor (exist_types: TSchemaUnitType[]) {
		super(`Schema doesn't contain any property of type ${exist_types.join(' | ')}`);
	}
}
