import { warn, validateUUID } from './';
import { v4 as uuidv4 } from 'uuid';

export function generateId (id?: string) {
	return id ? (validateUUID(id) ? id : warn('Invalid uuid provided') && uuidv4()) : uuidv4();
}
