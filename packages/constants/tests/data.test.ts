import { NotionConstants } from '../libs';

it('NotionConstants.data_types', () => {
	expect(NotionConstants.data_types()).toStrictEqual([
		'block',
		'collection',
		'collection_view',
		'space',
		'notion_user',
		'space_view',
		'user_root',
		'user_settings'
	]);
});
