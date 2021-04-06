import { NotionCore } from '../../../libs';
import { default_nishan_arg } from '../../utils';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`NotionCore.Api.GalleryView`, () => {
	new NotionCore.Api.GalleryView(default_nishan_arg);
});
