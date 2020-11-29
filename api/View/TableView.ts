import { ITableView, NishanArg } from "../../types";
import View from "./View";

class TableView extends View<ITableView> {
  constructor(arg: NishanArg) {
    super({ ...arg });
  }
}

export default TableView;
