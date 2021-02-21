/**
 * A notion specific error class, that is thrown when an unknown property, that doesn't exist in the schema is referenced
 */
export class UnknownPropertyReferenceError extends Error {
	/**
   * 
   * @param property The name of the property
   * @param path The path to the property
   */
	constructor (property: string, path: string[]) {
		super(`Unknown property ${property} referenced in ${path.join('.')}`);
	}
}
