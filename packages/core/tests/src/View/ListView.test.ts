import { ListView } from '../../../';
import { default_nishan_arg } from '../../utils/defaultNishanArg';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`ListView`, () => {
	new ListView(default_nishan_arg);
});
