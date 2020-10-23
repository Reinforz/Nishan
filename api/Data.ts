import { NishanArg, TData } from "../types/types";
import Getters from "./Getters";

export default class Data extends Getters {
  data: TData;
  constructor(arg: NishanArg) {
    super(arg);
    this.data = arg.data;
  }

  async getParent() {
    if ((this.data as any).parent_id) {
      const parent = this.cache.block.get((this.data as any).parent_id);
      return parent;
    }
  }
}