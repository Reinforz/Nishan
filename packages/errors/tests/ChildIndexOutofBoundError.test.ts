import colors from 'colors';
import { NotionErrors } from '../libs';

it(`ChildIndexOutofBoundError`, () => {
	expect(new NotionErrors.child_index_out_of_bound(3, 2, 'data').message).toBe(
		colors.bold.red(`Parent doesn't contain any children at index 3.\nParent child container data contains 2 items.`)
	);
});
