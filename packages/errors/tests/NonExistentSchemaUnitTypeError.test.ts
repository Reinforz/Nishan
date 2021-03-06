import colors from 'colors';
import { NotionErrors } from '../libs';

it(`NonExistentSchemaUnitTypeError`, () => {
	expect(new NotionErrors.non_existent_schema_unit_type([ 'checkbox', 'title' ]).message).toBe(
		colors.bold.red(`Schema doesn't contain any property of type checkbox | title`)
	);
});
