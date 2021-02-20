import { updateLastEditedProps } from '../../../../libs/ChildTraverser/utils';

it(`updateLastEditedProps`, () => {
	const data = {};
	updateLastEditedProps(data, 'user_1');
	expect(data).toStrictEqual({
		last_edited_time: expect.any(Number),
		last_edited_by_table: 'notion_user',
		last_edited_by_id: 'user_1'
	});
});
