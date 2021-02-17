import { CalendarView } from '../../../src';
import { default_nishan_arg } from '../../defaultNishanArg';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`CalendarView`, () => {
	new CalendarView(default_nishan_arg);
});
