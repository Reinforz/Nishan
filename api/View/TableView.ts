import { ITableView, NishanArg } from "../../types";
import Aggregator from "./Aggregator";

class TableView extends Aggregator<ITableView> {
  constructor(arg: NishanArg) {
    super({ ...arg });
  }
}

export default TableView;
