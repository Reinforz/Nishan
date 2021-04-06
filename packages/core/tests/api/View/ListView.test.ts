import { NotionCore } from '../../../libs';
import { default_nishan_arg } from '../../utils';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`NotionCore.Api.ListView`, () => {
	new NotionCore.Api.ListView(default_nishan_arg);
});
