import { ITimelineView, NishanArg } from "../../types";
import Aggregator from "./Aggregator";

class TimelineView extends Aggregator<ITimelineView> {
  constructor(arg: NishanArg) {
    super({ ...arg });
  }
}

export default TimelineView;