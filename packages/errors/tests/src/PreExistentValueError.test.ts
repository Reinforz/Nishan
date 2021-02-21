import colors from 'colors';
import { PreExistentValueError } from '../../src';

it(`PreExistentValueError`, () => {
	expect(new PreExistentValueError('value_type', 'value_for', 'value_current').message).toBe(
		colors.bold.red(`There is already a value for value_type on value_for, value_current.`)
	);
});
