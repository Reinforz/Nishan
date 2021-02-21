export class UnknownPropertyReferenceError extends Error {
	constructor (property: string, path: string[]) {
		super(`Unknown property ${property} referenced in ${path.join('.')}`);
	}
}
