import { v4, validate } from 'uuid';
import { idToUuid } from './id2uuid';
import { uuidToId } from './uuid2id';

/**
 * Generates notion specific id, using the passed id or a new one
 * @param id The optional id that would be returned if its valid
 */
export function generateId (id?: string) {
	if (id) {
		// Checks if the passed id is valid or not
		// transform to regular id then back to uuid to validate
		const is_valid = validate(idToUuid(uuidToId(id)));
		// if valid no point in creating a new one, return it
		if (is_valid) return id;
		else {
			// else if the passed id is not valid, log to console and return a mew one
			console.log('Invalid uuid provided');
			return v4();
		}
		// if no id parameter was passed return a new id
	} else return v4();
}
