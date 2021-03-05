import { ISpace, TBlock } from "@nishans/types";

/**
   * Extracts and returns an array of notion user ids from the passed data
   * @param data Data to extract notion user id from
   * @returns Array of extracted notion user ids
   */
export function extractNotionUserIds(data: TBlock | ISpace){
  const notion_users: Set<string> = new Set();
  (data as ISpace).permissions?.forEach(
      (permission) => permission.type === 'user_permission' && notion_users.add(permission.user_id)
    );
  notion_users.add(data.last_edited_by_id);
  notion_users.add(data.created_by_id);
  return Array.from(notion_users);
}