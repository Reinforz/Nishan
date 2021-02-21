import colors from 'colors';
import { NonExistentSchemaUnitTypeError } from '../../src/NonExistentSchemaUnitTypeError';

it(`NonExistentSchemaUnitTypeError`, () => {
	expect(new NonExistentSchemaUnitTypeError([ 'checkbox', 'title' ]).message).toBe(
		colors.bold.red(`Schema doesn't contain any property of type checkbox | title`)
	);
});
