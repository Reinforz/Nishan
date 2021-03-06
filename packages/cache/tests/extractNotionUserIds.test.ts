import { NotionCache } from '../libs';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`Should work correctly`, () => {
	const extracted_notion_user_ids = NotionCache.extractNotionUserIds({
		last_edited_by_id: 'notion_user_1',
		created_by_id: 'notion_user_2',
		permissions: [
			{
				type: 'user_permission',
				user_id: 'notion_user_3'
			},
			{
				type: 'space_permission'
			},
			{
				type: 'user_permission',
				user_id: 'notion_user_1'
			}
		]
	} as any);
	expect(extracted_notion_user_ids).toStrictEqual([ 'notion_user_3', 'notion_user_1', 'notion_user_2' ]);
});
