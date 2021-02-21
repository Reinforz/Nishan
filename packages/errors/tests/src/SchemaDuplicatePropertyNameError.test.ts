import { SchemaDuplicatePropertyNameError } from '../../src';

it(`SchemaDuplicatePropertyNameError`, () => {
	expect(new SchemaDuplicatePropertyNameError('Name').message).toBe(`Schema already contains property with name Name.`);
});
