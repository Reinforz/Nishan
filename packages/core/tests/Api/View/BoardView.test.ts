import { NotionCore } from '../../../libs';
import { default_nishan_arg } from '../../utils';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`NotionCore.Api.BoardView`, () => {
	new NotionCore.Api.BoardView(default_nishan_arg);
});
