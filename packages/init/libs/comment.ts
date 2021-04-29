import { IComment } from '@nishans/types';

export const comment = (
  arg: Pick<
    IComment,
    | 'parent_id'
    | 'text'
    | 'id'
    | 'space_id'
    | 'created_by_id'
    | 'last_edited_by_id'
  >
) => {
  return {
    parent_id: arg.parent_id,
    parent_table: 'discussion',
    text: arg.text,
    alive: true,
    id: arg.id,
    version: 1,
    space_id: arg.space_id,
    created_by_id: arg.created_by_id,
    created_by_table: 'notion_user',
    created_time: Date.now(),
    last_edited_by_id: arg.last_edited_by_id,
    last_edited_by_table: 'notion_user',
    last_edited_time: Date.now()
  } as IComment;
};
