import { IOperation, Request } from "../types/types";

import { v4 as uuidv4 } from 'uuid';

export default (shardId: number, spaceId: string, operations: IOperation[]) => {
  return {
    requestId: uuidv4(),
    transactions: [{
      id: uuidv4(),
      shardId,
      spaceId,
      operations
    }]
  } as Request;
}
