import { IOperation } from "@nishans/types";
import { CommonPluginOptions } from "../../types";

export function skipOption(options: CommonPluginOptions | undefined, operation: IOperation){
  let should_skip = false;
  if(options?.skip) should_skip = options?.skip(operation);
  if(should_skip) return operation;
}