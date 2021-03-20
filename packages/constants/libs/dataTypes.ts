import { TDataType } from '@nishans/types';

export const createDataTypes = () => {
	return [
		'block',
		'collection',
		'collection_view',
		'space',
		'notion_user',
		'space_view',
		'user_root',
		'user_settings',
		'notification',
		'comment',
		'slack_integration',
		'discussion',
		'follow',
		'page_visits'
	] as TDataType[];
};
