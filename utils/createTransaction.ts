import { Operation, Request } from "../types";

const { v4: uuidv4 } = require('uuid');

export default (shardId: number, spaceId: string, operations: Operation[][]) => {
  return {
    requestId: uuidv4(),
    transactions: operations.map((operations) => ({
      id: uuidv4(),
      shardId,
      spaceId,
      operations
    }))
  } as Request;
}
