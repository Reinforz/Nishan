/**
 * Creates a notion collection schema compatible id
 * @param length The length of the short id
 */
export function createShortId (length = 4) {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * characters.length));
	return result;
}
