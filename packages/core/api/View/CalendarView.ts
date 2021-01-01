import { ICalendarView, NishanArg } from "../../types";
import View from "./View";

/**
 * A class to represent calendar view of Notion
 * @noInheritDoc
 */

class CalendarView extends View<ICalendarView> {
  constructor(arg: NishanArg) {
    super({ ...arg });
  }
}

export default CalendarView;
