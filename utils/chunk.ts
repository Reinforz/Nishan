import { Args, Operation, } from "../types";

/* export type OperationArgs = (id: string, path: string[], args: Args) => Operation;
export type EditedArgs = (block_id: string, user_id: string) => Operation[]; */

export const spaceSet = (id: string, path: string[], args: Args): Operation => {
  return {
    path,
    table: 'space',
    command: 'set',
    args,
    id
  }
}

export const spaceUpdate = (id: string, path: string[], args: Args): Operation => {
  return {
    path,
    table: 'space',
    command: 'update',
    args,
    id
  }
}

export const spaceListAfter = (id: string, path: string[], args: Args): Operation => {
  return {
    path,
    table: 'space',
    command: 'listAfter',
    args,
    id
  }
}

export const spaceListBefore = (id: string, path: string[], args: Args): Operation => {
  return {
    path,
    table: 'space',
    command: 'listBefore',
    args,
    id
  }
}

export const spaceListRemove = (id: string, path: string[], args: Args): Operation => {
  return {
    path,
    table: 'space',
    command: 'listRemove',
    args,
    id
  }
}

export const spaceViewSet = (id: string, path: string[], args: Args): Operation => {
  return {
    path,
    table: 'space_view',
    command: 'set',
    args,
    id
  }
}

export const spaceViewUpdate = (id: string, path: string[], args: Args): Operation => {
  return {
    path,
    table: 'space_view',
    command: 'update',
    args,
    id
  }
}

export const spaceViewListAfter = (id: string, path: string[], args: Args): Operation => {
  return {
    path,
    table: 'space_view',
    command: 'listAfter',
    args,
    id
  }
}

export const spaceViewListBefore = (id: string, path: string[], args: Args): Operation => {
  return {
    path,
    table: 'space_view',
    command: 'listBefore',
    args,
    id
  }
}

export const spaceViewListRemove = (id: string, path: string[], args: Args): Operation => {
  return {
    path,
    table: 'space_view',
    command: 'listRemove',
    args,
    id
  }
}

export const collectionSet = (id: string, path: string[], args: Args): Operation => {
  return {
    path,
    table: 'collection',
    command: 'set',
    args,
    id
  }
}

export const collectionUpdate = (id: string, path: string[], args: Args): Operation => {
  return {
    path,
    table: 'collection',
    command: 'update',
    args,
    id
  }
}

export const collectionListAfter = (id: string, path: string[], args: Args): Operation => {
  return {
    path,
    table: 'collection',
    command: 'listAfter',
    args,
    id
  }
}

export const collectionListBefore = (id: string, path: string[], args: Args): Operation => {
  return {
    path,
    table: 'collection',
    command: 'listBefore',
    args,
    id
  }
}

export const collectionListRemove = (id: string, path: string[], args: Args): Operation => {
  return {
    path,
    table: 'collection',
    command: 'listRemove',
    args,
    id
  }
}

export const blockSet = (id: string, path: string[], args: Args): Operation => {
  return {
    path,
    table: 'block',
    command: 'set',
    args,
    id
  }
}

export const blockUpdate = (id: string, path: string[], args: Args): Operation => {
  return {
    path,
    table: 'block',
    command: 'update',
    args,
    id
  }
}

export const blockListAfter = (id: string, path: string[], args: Args): Operation => {
  return {
    path,
    table: 'block',
    command: 'listAfter',
    args,
    id
  }
}

export const blockListBefore = (id: string, path: string[], args: Args): Operation => {
  return {
    path,
    table: 'block',
    command: 'listBefore',
    args,
    id
  }
}

export const blockListRemove = (id: string, path: string[], args: Args): Operation => {
  return {
    path,
    table: 'block',
    command: 'listRemove',
    args,
    id
  }
}

export const pageSet = (id: string, path: string[], args: Args): Operation => {
  return {
    path,
    table: 'page',
    command: 'set',
    args,
    id
  }
}

export const pageUpdate = (id: string, path: string[], args: Args): Operation => {
  return {
    path,
    table: 'page',
    command: 'update',
    args,
    id
  }
}

export const pageListAfter = (id: string, path: string[], args: Args): Operation => {
  return {
    path,
    table: 'page',
    command: 'listAfter',
    args,
    id
  }
}

export const pageListBefore = (id: string, path: string[], args: Args): Operation => {
  return {
    path,
    table: 'page',
    command: 'listBefore',
    args,
    id
  }
}

export const pageListRemove = (id: string, path: string[], args: Args): Operation => {
  return {
    path,
    table: 'page',
    command: 'listRemove',
    args,
    id
  }
}

export const collectionViewSet = (id: string, path: string[], args: Args): Operation => {
  return {
    path,
    table: 'collection_view',
    command: 'set',
    args,
    id
  }
}

export const collectionViewUpdate = (id: string, path: string[], args: Args): Operation => {
  return {
    path,
    table: 'collection_view',
    command: 'update',
    args,
    id
  }
}

export const collectionViewListAfter = (id: string, path: string[], args: Args): Operation => {
  return {
    path,
    table: 'collection_view',
    command: 'listAfter',
    args,
    id
  }
}

export const collectionViewListBefore = (id: string, path: string[], args: Args): Operation => {
  return {
    path,
    table: 'collection_view',
    command: 'listBefore',
    args,
    id
  }
}

export const collectionViewListRemove = (id: string, path: string[], args: Args): Operation => {
  return {
    path,
    table: 'collection_view',
    command: 'listRemove',
    args,
    id
  }
}

export const collectionViewPageSet = (id: string, path: string[], args: Args): Operation => {
  return {
    path,
    table: 'collection_view_page',
    command: 'set',
    args,
    id
  }
}

export const collectionViewPageUpdate = (id: string, path: string[], args: Args): Operation => {
  return {
    path,
    table: 'collection_view_page',
    command: 'update',
    args,
    id
  }
}

export const collectionViewPageListAfter = (id: string, path: string[], args: Args): Operation => {
  return {
    path,
    table: 'collection_view_page',
    command: 'listAfter',
    args,
    id
  }
}

export const collectionViewPageListBefore = (id: string, path: string[], args: Args): Operation => {
  return {
    path,
    table: 'collection_view_page',
    command: 'listBefore',
    args,
    id
  }
}

export const collectionViewPageListRemove = (id: string, path: string[], args: Args): Operation => {
  return {
    path,
    table: 'collection_view_page',
    command: 'listRemove',
    args,
    id
  }
}

export const notionUserSet = (id: string, path: string[], args: Args): Operation => {
  return {
    path,
    table: 'notion_user',
    command: 'set',
    args,
    id
  }
}

export const notionUserUpdate = (id: string, path: string[], args: Args): Operation => {
  return {
    path,
    table: 'notion_user',
    command: 'update',
    args,
    id
  }
}

export const notionUserListAfter = (id: string, path: string[], args: Args): Operation => {
  return {
    path,
    table: 'notion_user',
    command: 'listAfter',
    args,
    id
  }
}

export const notionUserListBefore = (id: string, path: string[], args: Args): Operation => {
  return {
    path,
    table: 'notion_user',
    command: 'listBefore',
    args,
    id
  }
}

export const notionUserListRemove = (id: string, path: string[], args: Args): Operation => {
  return {
    path,
    table: 'notion_user',
    command: 'listRemove',
    args,
    id
  }
}

export const userSettingsSet = (id: string, path: string[], args: Args): Operation => {
  return {
    path,
    table: 'user_settings',
    command: 'set',
    args,
    id
  }
}

export const userSettingsUpdate = (id: string, path: string[], args: Args): Operation => {
  return {
    path,
    table: 'user_settings',
    command: 'update',
    args,
    id
  }
}

export const userSettingsListAfter = (id: string, path: string[], args: Args): Operation => {
  return {
    path,
    table: 'user_settings',
    command: 'listAfter',
    args,
    id
  }
}

export const userSettingsListBefore = (id: string, path: string[], args: Args): Operation => {
  return {
    path,
    table: 'user_settings',
    command: 'listBefore',
    args,
    id
  }
}

export const userSettingsListRemove = (id: string, path: string[], args: Args): Operation => {
  return {
    path,
    table: 'user_settings',
    command: 'listRemove',
    args,
    id
  }
}

export const createOperation = (block_id: string, user_id: string) => [
  blockSet(block_id, ['created_by_id'], user_id),
  blockSet(block_id, ['created_by_table'], 'notion_user'),
  blockSet(block_id, ['created_time'], Date.now())
];

export const lastEditOperations = (block_id: string, user_id: string) => [
  blockSet(block_id, ['last_edited_time'], Date.now()),
  blockSet(block_id, ['last_edited_by_id'], user_id),
  blockSet(block_id, ['last_edited_by_table'], 'notion_user')
];