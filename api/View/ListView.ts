import { IListView, NishanArg } from "../../types";
import View from "./View";

class ListView extends View<IListView> {
  constructor(arg: NishanArg) {
    super({ ...arg });
  }
}

export default ListView;