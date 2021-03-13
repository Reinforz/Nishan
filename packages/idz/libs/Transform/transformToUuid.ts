/**
 * Convert notion id to uuid
 * @param id The id to convert to uuid
 * @returns The converted notion uuid
 */
export const transformToUuid = (id: string) =>
	`${id.substr(0, 8)}-${id.substr(8, 4)}-${id.substr(12, 4)}-${id.substr(16, 4)}-${id.substr(20)}`;
