import { NonExistentSchemaUnitTypeError } from '../../src/NonExistentSchemaUnitTypeError';

it(`NonExistentSchemaUnitTypeError`, () => {
	expect(new NonExistentSchemaUnitTypeError([ 'checkbox', 'title' ]).message).toBe(
		`Schema doesn't contain any property of type checkbox | title`
	);
});
