import { NonExistentDataError } from '../../src';

it(`NonExistentDataError`, () => {
	expect(new NonExistentDataError('collection', '123').message).toBe(`collection:123 doesn't exist`);
});
