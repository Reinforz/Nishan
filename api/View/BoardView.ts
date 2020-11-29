import { IBoardView, NishanArg } from "../../types";
import Aggregator from "./Aggregator";

class BoardView extends Aggregator<IBoardView> {
  constructor(arg: NishanArg) {
    super({ ...arg });
  }
}

export default BoardView;