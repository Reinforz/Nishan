/* Credit goes to @transitive-bullshit https://github.com/transitive-bullshit*/
export const idToUuid = (id: string) =>
	`${id.substr(0, 8)}-${id.substr(8, 4)}-${id.substr(12, 4)}-${id.substr(16, 4)}-${id.substr(20)}`;

export const uuidToId = (uuid: string) => uuid.replace(/-/g, '');
