import { TBlock } from '@nishans/types';

export const blockMetadata = (
  arg: Pick<TBlock, 'created_by_id' | 'last_edited_by_id' | 'space_id'>
) => {
  return {
    created_time: Date.now(),
    created_by_id: arg.created_by_id,
    created_by_table: 'notion_user',
    last_edited_time: Date.now(),
    last_edited_by_table: 'notion_user',
    last_edited_by_id: arg.last_edited_by_id,
    space_id: arg.space_id,
    version: 0,
    alive: true
  };
};
