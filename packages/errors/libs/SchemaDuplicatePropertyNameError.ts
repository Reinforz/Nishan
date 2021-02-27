import colors from 'colors';

/**
 * Thrown when schema contains duplicate property name
 */
export class SchemaDuplicatePropertyNameError extends Error {
	/**
   * @param property_name The name of the duplicate property
   */
	constructor (property_name: string) {
		super(colors.bold.red(`Schema already contains property with name ${property_name}.`));
	}
}
