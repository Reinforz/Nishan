/**
 * convert notion uuid to id
 * @param uuid The uuid to convert to an id
 * @returns The converted id
 */
export const uuidToId = (uuid: string) => uuid.replace(/-/g, '');
