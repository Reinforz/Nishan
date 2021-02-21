import { v4, validate } from 'uuid';

export function generateId (id?: string) {
	if (id) {
		const is_valid = validate(id);
		if (is_valid) return id;
		else {
			console.log('Invalid uuid provided');
			return v4();
		}
	}
}
