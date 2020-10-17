import Nishan from "../Nishan";

import { NishanArg, Space as ISpace } from "../types";

// ? FEAT:2 Add space related methods
class Space extends Nishan {
  space_data: ISpace;

  constructor(arg: NishanArg & { space_data: ISpace }) {
    super(arg)
    this.space_data = arg.space_data;
  }
}

export default Space;
