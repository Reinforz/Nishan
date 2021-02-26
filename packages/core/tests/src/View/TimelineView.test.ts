import { TimelineView } from '../../../';
import { default_nishan_arg } from '../../utils/defaultNishanArg';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`TimelineView`, () => {
	new TimelineView(default_nishan_arg);
});
