import { TableView } from '../../../libs';
import { default_nishan_arg } from '../../utils';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`TableView`, () => {
	new TableView(default_nishan_arg);
});
