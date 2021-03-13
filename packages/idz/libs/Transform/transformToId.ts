/**
 * convert notion uuid to id
 * @param uuid The uuid to convert to an id
 * @returns The converted id
 */
export const transformToId = (uuid: string) => uuid.replace(/-/g, '');
