import { NishanArg } from "../../types";
import View from "./View";

class BoardView extends View {
  constructor(arg: NishanArg) {
    super({ ...arg });
  }
}

export default BoardView;