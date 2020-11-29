import { ITimelineView, NishanArg } from "../../types";
import View from "./View";

class TimelineView extends View<ITimelineView> {
  constructor(arg: NishanArg) {
    super({ ...arg });
  }
}

export default TimelineView;