import { ListView } from '../../../libs';
import { default_nishan_arg } from '../../utils';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`ListView`, () => {
	new ListView(default_nishan_arg);
});
