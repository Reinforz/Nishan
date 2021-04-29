import { NotionInit } from '../libs';

it(`comment`, () => {
  const arg: any = {
    created_by_id: 'notion_user_1',
    last_edited_by_id: 'notion_user_1',
    id: 'comment_1',
    parent_id: 'discussion_1',

    space_id: 'space_1',
    text: [['Text']]
  };
  expect(NotionInit.comment(arg)).toStrictEqual(
    expect.objectContaining({
      ...arg,
      parent_table: 'discussion',
      alive: true,
      version: 1,
      created_by_table: 'notion_user',
      last_edited_by_table: 'notion_user',
      created_time: expect.any(Number),
      last_edited_time: expect.any(Number)
    })
  );
});
