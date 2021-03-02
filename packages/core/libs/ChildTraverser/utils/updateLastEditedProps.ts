import { deepMerge } from '@nishans/fabricator';

export function updateLastEditedProps (block: any, user_id: string) {
	const last_edited_props = {
		last_edited_time: Date.now(),
		last_edited_by_table: 'notion_user',
		last_edited_by_id: user_id
	};
	deepMerge(block, last_edited_props);
	return last_edited_props;
}
