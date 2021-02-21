import { TSchemaUnitType } from '@nishans/types';

export class UnsupportedPropertyTypeError extends Error {
	constructor (property: string, path: string[], given_type: TSchemaUnitType, supported_types: TSchemaUnitType[]) {
		const message = `Property ${property} referenced in ${path.join(
			'.'
		)} is not of the supported types\nGiven type: ${given_type}\nSupported types: ${supported_types.join(' | ')}`;
		super(message);
	}
}
