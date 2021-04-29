import {
  CollectionExtracted,
  PageExtracted,
  TViewExtracted
} from '@nishans/extract';
import { createExecuteOperationsMock } from '../../../../utils/tests';
import { o } from '../../../core/tests/utils';
import { NotionSync } from '../../libs';

afterEach(() => {
  jest.restoreAllMocks();
});

it('writeToNotion', async () => {
  const view_1: TViewExtracted = {
      format: {} as any,
      name: 'View',
      type: 'board',
      query2: {}
    },
    collection_1: CollectionExtracted = {
      name: [['Name']],
      schema: {},
      cover: '',
      description: [['']],
      icon: ''
    },
    row_page_1: PageExtracted = {
      properties: {
        title: [['Title']]
      },
      format: {}
    },
    template_page_1: PageExtracted = {
      properties: {
        title: [['Title']]
      },
      format: {}
    };

  const { e1 } = createExecuteOperationsMock();

  await NotionSync.Write.toNotion(
    {
      collection: collection_1,
      views: [view_1],
      row_pages: [row_page_1],
      template_pages: [template_page_1]
    },
    {
      space_id: 'space_1',
      token: 'token',
      user_id: 'user_1'
    }
  );

  e1([
    o.b.u(
      expect.any(String),
      [],
      expect.objectContaining({
        collection_id: expect.any(String),
        id: expect.any(String),
        parent_id: 'space_1',
        parent_table: 'space',
        permissions: [
          { role: 'editor', type: 'user_permission', user_id: 'user_1' }
        ],
        type: 'collection_view_page',
        view_ids: [expect.any(String)]
      })
    ),
    o.c.u(
      expect.any(String),
      [],
      expect.objectContaining({
        cover: '',
        icon: '',
        id: expect.any(String),
        name: [['Name']],
        parent_id: expect.any(String),
        parent_table: 'block',
        schema: {},
        template_pages: [expect.any(String)]
      })
    ),
    o.cv.u(
      expect.any(String),
      [],
      expect.objectContaining({
        format: {},
        id: expect.any(String),
        name: 'View',
        parent_id: expect.any(String),
        parent_table: 'block',
        query2: {},
        type: 'board'
      })
    ),
    o.b.u(
      expect.any(String),
      [],
      expect.objectContaining({
        content: [],
        format: {},
        id: expect.any(String),
        parent_id: expect.any(String),
        parent_table: 'collection',
        permissions: [
          { role: 'editor', type: 'user_permission', user_id: 'user_1' }
        ],
        properties: { title: [['Title']] },
        type: 'page'
      })
    ),
    o.b.u(
      expect.any(String),
      [],
      expect.objectContaining({
        content: [],
        format: {},
        id: expect.any(String),
        is_template: true,
        parent_id: expect.any(String),
        parent_table: 'collection',
        permissions: [
          { role: 'editor', type: 'user_permission', user_id: 'user_1' }
        ],
        properties: { title: [['Title']] },
        type: 'page'
      })
    ),
    o.s.la(expect.any(String), ['pages'], {
      after: '',
      id: expect.any(String)
    })
  ]);
});
