import { NotionConstants } from '../libs';

it('NotionConstants.view_types', () => {
	expect(NotionConstants.view_types()).toStrictEqual([ 'board', 'gallery', 'list', 'timeline', 'table', 'calendar' ]);
});
