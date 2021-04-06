import { NotionCore } from '../../../libs';
import { default_nishan_arg } from '../../utils';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`NotionCore.Api.TableView`, () => {
	new NotionCore.Api.TableView(default_nishan_arg);
});
