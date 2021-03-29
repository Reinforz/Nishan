import { ISpaceView } from '@nishans/types';

export const spaceView = (arg: Pick<ISpaceView, 'parent_id' | 'space_id' | 'id'>) => {
	return {
		created_getting_started: false,
		created_onboarding_templates: false,
		space_id: arg.space_id,
		notify_mobile: true,
		notify_desktop: true,
		notify_email: true,
		parent_id: arg.parent_id,
		parent_table: 'user_root',
		alive: true,
		joined: true,
		id: arg.id,
		version: 1,
		visited_templates: [],
		sidebar_hidden_templates: [],
		bookmarked_pages: []
	} as ISpaceView;
};
