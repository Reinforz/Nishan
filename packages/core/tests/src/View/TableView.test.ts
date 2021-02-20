import { TableView } from '../../../src';
import { default_nishan_arg } from '../../utils/defaultNishanArg';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`TableView`, () => {
	new TableView(default_nishan_arg);
});
