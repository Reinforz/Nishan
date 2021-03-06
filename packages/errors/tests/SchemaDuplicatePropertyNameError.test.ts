import colors from 'colors';
import { NotionErrors } from '../libs';

it(`SchemaDuplicatePropertyNameError`, () => {
	expect(new NotionErrors.schema_duplicate_property_name('Name').message).toBe(
		colors.bold.red(`Schema already contains property with name Name.`)
	);
});
