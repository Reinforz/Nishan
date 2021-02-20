import { BoardView } from '../../../src';
import { default_nishan_arg } from '../../utils/defaultNishanArg';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`BoardView`, () => {
	new BoardView(default_nishan_arg);
});
