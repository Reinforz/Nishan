import {
  error,
} from "../utils";

import { Predicate, TData, } from "../types";
import Data from "../api/Data";

type Constructor<T extends TData, E = Data<T>> = new (...args: any[]) => E;

export default function GetItems<T extends TData>(Base: Constructor<T>) {
  return class GetItems extends Base {
    constructor(...args: any[]) {
      super(args[0]);
    }

    async getItems(arg: undefined | string[] | Predicate<T>, multiple: boolean = true, path: string, cb: (T: T) => Promise<T>) {
      const data = this.getCachedData(), blocks: T[] = [];
      if ((data as any)[path]) {
        if (Array.isArray(arg)) {
          for (let index = 0; index < arg.length; index++) {
            const block_id = arg[index], block = this.getCachedData(block_id);
            let should_add = (data as any)[path].includes(block_id);
            if (should_add)
              blocks.push(await cb(block));
            if (!multiple && blocks.length === 1) break;
          }
        } else if (typeof arg === "function" || arg === undefined) {
          for (let index = 0; index < (data as any)[path].length; index++) {
            const block_id = (data as any)[path][index], block: T = this.getCachedData(block_id);
            let should_add = typeof arg === "function" ? await arg(block, index) : true;
            if (should_add) blocks.push(await cb(block))
            if (!multiple && blocks.length === 1) break;
          }
        }
        return blocks;
      } else
        throw new Error(error("This page doesnot have any content"));
    }
  }
}