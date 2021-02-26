import { TimelineView } from '../../../libs';
import { default_nishan_arg } from '../../utils';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`TimelineView`, () => {
	new TimelineView(default_nishan_arg);
});
