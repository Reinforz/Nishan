import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

import Page from './Page';
import Nishan from "../Nishan";

import { NishanArg, Space as ISpace } from "../types";

// ? FEAT:2 Add space related methods
class Space extends Nishan {
  space_data: ISpace;

  constructor({ interval, user_id, token, space_data, cache }: NishanArg & { space_data: ISpace }) {
    super({
      space_id: space_data.id,
      shard_id: space_data.shard_id,
      interval,
      user_id,
      token,
      cache
    })
    this.space_data = space_data;
  }
}

export default Space;
