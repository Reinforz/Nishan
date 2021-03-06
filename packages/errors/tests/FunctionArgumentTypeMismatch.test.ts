import colors from 'colors';
import { NotionErrors } from '../libs';

it(`FunctionArgumentTypeMismatch`, () => {
	expect(new NotionErrors.function_argument_type_mismatch('number', 1, 'max').message).toBe(
		colors.bold.red(`Argument of type number can't be used as argument 1 for function max.`)
	);
});
