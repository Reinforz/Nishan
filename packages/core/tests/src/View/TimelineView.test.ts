import { TimelineView } from '../../../src';
import { default_nishan_arg } from '../../defaultNishanArg';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`TimelineView`, () => {
	new TimelineView(default_nishan_arg);
});
