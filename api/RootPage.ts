/* import axios from "axios";
import {
  v4 as uuidv4
} from 'uuid'; */
import Page from "./Page";

import { NishanArg, } from "../types/types";
import { IRootPage } from "../types/block";

/**
 * A class to represent RootPage type block of Notion
 * @noInheritDoc
 */
class RootPage extends Page<IRootPage>{
  constructor(arg: NishanArg<IRootPage>) {
    super(arg);
  }
}

export default RootPage;