import { NotionInit } from '../libs';

it(`discussion`, () => {
  const arg: any = {
    comments: ['comment_1'],
    resolved: false,
    id: 'comment_1',
    parent_id: 'discussion_1',

    space_id: 'space_1',
    context: [['Text']]
  };
  expect(NotionInit.discussion(arg)).toStrictEqual(
    expect.objectContaining({
      ...arg,
      parent_table: 'block',
      version: 1
    })
  );
});
