import { IBoardView, NishanArg } from "../../types";
import View from "./View";

class BoardView extends View<IBoardView> {
  constructor(arg: NishanArg) {
    super({ ...arg });
  }
}

export default BoardView;