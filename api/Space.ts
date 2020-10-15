import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

import Page from './Page';
import Nishan from "./Nishan";

import createTransaction from "../utils/createTransaction";

import { warn } from "../utils/logs";

class Space extends Nishan {
  createTransaction: any

  constructor({ interval, user_id, token, space_data }: { space_data: ISpace, token: string, interval: number, user_id: string }) {
    super({
      interval,
      user_id,
      token,
    })
    this.space_data = space_data;
    this.interval = interval;
    this.user_id = user_id;
    this.createTransaction = createTransaction.bind(this, space_data.shard_id, space_data.id);
  }
}

export default Space;
