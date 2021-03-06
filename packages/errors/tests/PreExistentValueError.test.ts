import colors from 'colors';
import { NotionErrors } from '../libs';

it(`PreExistentValueError`, () => {
	expect(new NotionErrors.pre_existent_value('value_type', 'value_for', 'value_current').message).toBe(
		colors.bold.red(`There is already a value for value_type on value_for, value_current.`)
	);
});
