import { TSchemaUnitType } from '@nishans/types';
import colors from 'colors';

/**
 * A notion specific error class, that is thrown when the property type doesn't match the supported types
 */
export class UnsupportedPropertyType extends Error {
	/**
   * @param property The name of the property
   * @param path The path to the property
   * @param given_type The given type of the property
   * @param supported_types The supported type of the property
   */
	constructor (property: string, path: string[], given_type: TSchemaUnitType, supported_types: TSchemaUnitType[]) {
		super(
			colors.bold.red(
				`Property ${property} referenced in ${path.join(
					'.'
				)} is not of the supported types\nGiven type: ${given_type}\nSupported types: ${supported_types.join(' | ')}`
			)
		);
	}
}
