import { warn, validateUUID } from './';
import { v4 as uuidv4 } from 'uuid';

export function generateId (id?: string) {
	return id ? (validateUUID(id) ? id : warn('Invalid uuid provided') && uuidv4()) : uuidv4();
}

export function createShortId (length = 5) {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * characters.length));
	return result;
}
