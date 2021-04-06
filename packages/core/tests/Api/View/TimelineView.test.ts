import { NotionCore } from '../../../libs';
import { default_nishan_arg } from '../../utils';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`TimelineView`, () => {
	new NotionCore.Api.TimelineView(default_nishan_arg);
});
