export function updateLastEditedProps (block: any, user_id: string) {
	block.last_edited_time = Date.now();
	block.last_edited_by_table = 'notion_user';
	block.last_edited_by_id = user_id;
}
