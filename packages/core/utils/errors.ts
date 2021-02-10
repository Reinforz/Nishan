import { TSchemaUnitType } from '@nishans/types';

export class UnsupportedPropertyTypeError extends Error {
	constructor (property: string, path: string[], given_type: TSchemaUnitType, supported_types: TSchemaUnitType[]) {
		const message = `Property ${property} referenced in ${path.join(
			'.'
		)} is not of the supported types\nGiven type: ${given_type}\nSupported types: ${supported_types.join(' | ')}`;
		super(message);
	}
}

export class UnknownPropertyReferenceError extends Error {
	constructor (property: string, path: string[]) {
		super(`Unknown property ${property} referenced in ${path.join('.')}`);
	}
}

export class NonExistentSchemaUnitTypeError extends Error {
	constructor (exist_types: TSchemaUnitType[]) {
		super(`Schema doesnot contain any property of type ${exist_types.join(' | ')}`);
	}
}
