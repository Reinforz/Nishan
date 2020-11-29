import { ICalendarView, NishanArg } from "../../types";
import View from "./View";

class CalendarView extends View<ICalendarView> {
  constructor(arg: NishanArg) {
    super({ ...arg });
  }
}

export default CalendarView;
