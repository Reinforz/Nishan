import colors from 'colors';
import { NotionErrors } from '../libs';

it(`FunctionArgumentLengthMismatch`, () => {
	expect(new NotionErrors.function_argument_length_mismatch(2, [ 3 ], 'max').message).toBe(
		colors.bold.red(`Function max takes 3 arguments, given 2`)
	);
});
