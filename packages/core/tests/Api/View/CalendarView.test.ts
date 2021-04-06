import { NotionCore } from '../../../libs';
import { default_nishan_arg } from '../../utils';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`NotionCore.Api.CalendarView`, () => {
	new NotionCore.Api.CalendarView(default_nishan_arg);
});
