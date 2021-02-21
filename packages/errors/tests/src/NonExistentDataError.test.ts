import colors from 'colors';
import { NonExistentDataError } from '../../src';

it(`NonExistentDataError`, () => {
	expect(new NonExistentDataError('collection', '123').message).toBe(colors.bold.red(`collection:123 doesn't exist`));
});
