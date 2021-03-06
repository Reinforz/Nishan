import colors from 'colors';

/**
 * Thrown when a new value is trying to be set when there is already a previous value
 */
export class PreExistentValue extends Error {
	/**
   * @param value_type The type of the value
   * @param value_for For what does the duplicate value exists
   * @param value_current Current value
   */
	constructor (value_type: string, value_for: string, value_current: string) {
		super(colors.bold.red(`There is already a value for ${value_type} on ${value_for}, ${value_current}.`));
	}
}
