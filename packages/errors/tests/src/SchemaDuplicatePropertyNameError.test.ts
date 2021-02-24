import colors from 'colors';
import { SchemaDuplicatePropertyNameError } from '../../src';

it(`SchemaDuplicatePropertyNameError`, () => {
	expect(new SchemaDuplicatePropertyNameError('Name').message).toBe(
		colors.bold.red(`Schema already contains property with name Name.`)
	);
});