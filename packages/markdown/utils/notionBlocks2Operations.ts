import { IOperation, IPage } from '@nishans/types';
import { v4 as uuidv4 } from 'uuid';
import {
  CodeNotionBlock,
  NotionMarkdownConfig,
  NotionOperationData,
  TNotionBlocks,
  TodoNotionBlock
} from '../src';

export async function generateNotionBlockOperations(
  notion_data: NotionOperationData,
  notion_blocks: TNotionBlocks[],
  config: NotionMarkdownConfig
) {
  const { space_id, user_id } = notion_data;
  const metadata = {
    alive: true,
    created_time: Date.now(),
    created_by_id: user_id,
    created_by_table: 'notion_user',
    last_edited_time: Date.now(),
    last_edited_by_table: 'notion_user',
    last_edited_by_id: user_id,
    space_id,
    version: 0
  };
  const operations: IOperation[] = [];
  const block_id = uuidv4(),
    content_ids: string[] = [];

  const content_create_ops: IOperation[] = notion_blocks.map((block) => {
    const { type, id } = block,
      common_props: any = {
        table: 'block',
        command: 'update',
        id,
        path: [],
        args: {
          id,
          type,
          properties: {},
          parent_table: 'block',
          parent_id: block.parent_id ?? block_id,
          content: block.child_ids ?? [],
          ...metadata
        }
      };
    if (!block.parent_id) content_ids.push(id);

    if (type !== 'divider')
      common_props.args.properties.title = (block as any).title;

    switch (type) {
      case 'code':
        common_props.args.properties.language = (block as CodeNotionBlock).lang;
        break;
      case 'to_do':
        common_props.args.properties.checked = (block as TodoNotionBlock).checked;
        break;
    }

    return common_props;
  });

  operations.push({
    command: 'update',
    table: 'block',
    id: block_id,
    path: [],
    args: {
      id: block_id,
      type: 'page',
      content: content_ids,
      parent_id: space_id,
      parent_table: 'space',
      properties: {
        title: [[config.title]]
      },
      permissions: [
        {
          role: 'editor',
          type: 'user_permission',
          user_id
        }
      ],
      format: {
        page_full_width: true
      },
      ...metadata
    } as IPage
  });

  operations.push(...content_create_ops);

  operations.push({
    command: 'listAfter',
    table: 'space',
    id: space_id,
    path: ['pages'],
    args: {
      after: '',
      id: block_id
    }
  });

  return operations;
}
