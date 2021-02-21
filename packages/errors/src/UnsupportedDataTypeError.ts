import { TDataType } from '@nishans/types';

/**
 * A notion specific error class, that is thrown when the data type doesn't match the supported types
 */
export class UnsupportedDataTypeError extends Error {
	/**
   * @param given_data_type passed data type
   * @param supported_data_types The supported data type of the property
   */
	constructor (given_data_type: string, supported_data_types: TDataType[]) {
		const message = `Data type is not of the supported types\nGiven type: ${given_data_type}\nSupported types: ${supported_data_types.join(
			' | '
		)}`;
		super(message);
	}
}
