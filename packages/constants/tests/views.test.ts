import { TViewType } from '@nishans/types';
import { NotionConstants } from '../libs';

it('NotionConstants.view_types', () => {
	const view_types = NotionConstants.view_types();
	const expected_view_types: TViewType[] = [ 'board', 'gallery', 'list', 'timeline', 'table', 'calendar' ];

	expect(view_types.length === expected_view_types.length).toBe(true);
	expected_view_types.forEach((expected_view_type) => expect(view_types.includes(expected_view_type)).toBe(true));
});
