import { NotionInit } from '../libs';

it(`spaceView`, () => {
	const arg: any = {
		id: 'space_view_1',
		parent_id: 'user_root_1',
		space_id: 'space_1'
	};

	expect(NotionInit.spaceView(arg)).toStrictEqual({
		...arg,
		created_getting_started: false,
		created_onboarding_templates: false,
		notify_mobile: true,
		notify_desktop: true,
		notify_email: true,
		parent_table: 'user_root',
		alive: true,
		joined: true,
		version: 1,
		visited_templates: [],
		sidebar_hidden_templates: [],
		bookmarked_pages: []
	});
});
