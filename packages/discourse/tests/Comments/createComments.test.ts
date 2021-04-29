import { NotionCache } from '@nishans/cache';
import { NotionIdz } from '@nishans/idz';
import { default_nishan_arg, o } from '../../../core/tests/utils';
import { NotionDiscourse } from '../../libs';

afterEach(() => {
  jest.restoreAllMocks();
});

it(`NotionDiscourse.createComments`, async () => {
  const discussion_data: any = { id: 'discussion_1', comments: [] },
    cache = {
      ...NotionCache.createDefaultCache(),
      discussion: new Map([['discussion_1', discussion_data]])
    },
    options = {
      ...default_nishan_arg,
      cache
    },
    comment_id = NotionIdz.Generate.id(),
    comment_1_data = {
      parent_id: expect.any(String),
      parent_table: 'discussion',
      text: [['First Comment']],
      alive: true,
      id: comment_id,
      version: 1,
      space_id: options.space_id,
      created_by_id: options.user_id,
      created_by_table: 'notion_user',
      last_edited_by_id: options.user_id,
      last_edited_by_table: 'notion_user'
    };

  const { operations } = await NotionDiscourse.Comments.create(
    'discussion_1',
    [
      {
        text: [['First Comment']],
        id: comment_id
      }
    ],
    options
  );

  expect(operations).toStrictEqual([
    o.cm.u(comment_id, [], expect.objectContaining(comment_1_data)),
    o.d.la('discussion_1', ['comments'], {
      id: comment_id
    })
  ]);
  expect(cache.comment.get(comment_id)).toStrictEqual(
    expect.objectContaining(comment_1_data)
  );
  expect(discussion_data.comments).toStrictEqual([comment_id]);
});
