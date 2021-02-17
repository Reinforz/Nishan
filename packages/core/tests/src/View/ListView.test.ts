import { ListView } from '../../../src';
import { default_nishan_arg } from '../../defaultNishanArg';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`ListView`, () => {
	new ListView(default_nishan_arg);
});
