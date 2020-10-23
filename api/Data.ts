import { TParentType } from "../types/block";
import { NishanArg, TData } from "../types/types";
import { error } from "../utils/logs";
import Getters from "./Getters";

export default class Data extends Getters {
  data: TData;
  constructor(arg: NishanArg) {
    super(arg);
    this.data = arg.data;
  }

  getParent() {
    if ((this.data as any).parent_id) {
      const parent = this.cache.block.get((this.data as any).parent_id) as TParentType;
      if (!parent) throw new Error(error(`Block with id ${this.data.id} doesnot have a parent`));
      return parent;
    } else
      throw new Error(error(`Block with id ${this.data.id} doesnot have a parent`));
  }
}