import { NishanArg } from "../../types";
import View from "./View";

class TableView extends View {
  constructor(arg: NishanArg) {
    super({ ...arg });
  }
}