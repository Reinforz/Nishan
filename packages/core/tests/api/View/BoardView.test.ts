import { BoardView } from '../../../libs';
import { default_nishan_arg } from '../../utils';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`BoardView`, () => {
	new BoardView(default_nishan_arg);
});
