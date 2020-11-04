import { Args, IOperation, OperationCommand, OperationTable, } from "../types/types";

const tables = ["space", "space_view", "collection", "block", "collection_view", "collection_view_page", "notion_user", "user_settings", "user_root"] as OperationTable[];
const commands = ["listRemove", "listBefore", "listAfter", "update", "set"] as OperationCommand[];
const Operations: Record<OperationTable, Record<OperationCommand, ((id: string, path: string[], args: Args) => IOperation)>> = {} as any;

tables.forEach(table => {
  Operations[table] = {} as any;
  commands.forEach(command => {
    Operations[table][command] = (id: string, path: string[], args: Args): IOperation => {
      return {
        path,
        table,
        command,
        args,
        id
      }
    }
  })
});

export default Operations;