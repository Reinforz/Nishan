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
		'discussion',
		'comment',
		'follow',
		'slack_integration',
		'page_visits',
		'activity',
		'notification'
	] as TDataType[];
};
