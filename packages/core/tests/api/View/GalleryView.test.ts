import { GalleryView } from '../../../libs';
import { default_nishan_arg } from '../../utils';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`GalleryView`, () => {
	new GalleryView(default_nishan_arg);
});
