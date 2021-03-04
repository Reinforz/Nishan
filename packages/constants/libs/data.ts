import { TDataType } from '@nishans/types';

export const createDataTypesArray = () => {
	return [
		'block',
		'collection',
		'collection_view',
		'space',
		'notion_user',
		'space_view',
		'user_root',
		'user_settings'
	] as TDataType[];
};
