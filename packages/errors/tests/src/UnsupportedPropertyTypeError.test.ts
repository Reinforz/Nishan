import { UnsupportedPropertyTypeError } from '../../src/';

it(`UnsupportedPropertyTypeError`, () => {
	expect(new UnsupportedPropertyTypeError('Name', [ 'arg', 'name' ], 'text', [ 'checkbox', 'number' ]).message).toBe(
		`Property Name referenced in arg.name is not of the supported types\nGiven type: text\nSupported types: checkbox | number`
	);
});
