import { NishanArg } from "../../types";
import View from "./View";

class TimelineView extends View {
  constructor(arg: NishanArg) {
    super({ ...arg });
  }
}

export default TimelineView;