import { NotionInit } from '../libs';

it(`blockMetadata`, () => {
  expect(
    NotionInit.blockMetadata({
      created_by_id: 'user_1',
      last_edited_by_id: 'user_1',

      space_id: 'space_1'
    })
  ).toStrictEqual(
    expect.objectContaining({
      created_by_id: 'user_1',
      last_edited_by_id: 'user_1',

      space_id: 'space_1',
      version: 0,
      alive: true,
      created_time: expect.any(Number),
      last_edited_time: expect.any(Number),
      last_edited_by_table: 'notion_user',
      created_by_table: 'notion_user'
    })
  );
});
