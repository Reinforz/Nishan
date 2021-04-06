import { ICalendarView } from '@nishans/types';
import { INotionCoreOptions } from '../../';
import View from './View';

/**
 * A class to represent calendar view of Notion
 * @noInheritDoc
 */

class CalendarView extends View<ICalendarView, Partial<Pick<ICalendarView, 'format' | 'name' | 'query2' | 'type'>>> {
	constructor (arg: INotionCoreOptions) {
		super({ ...arg });
	}
}

export default CalendarView;
