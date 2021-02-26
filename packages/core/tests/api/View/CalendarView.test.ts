import { CalendarView } from '../../../libs';
import { default_nishan_arg } from '../../utils';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`CalendarView`, () => {
	new CalendarView(default_nishan_arg);
});
