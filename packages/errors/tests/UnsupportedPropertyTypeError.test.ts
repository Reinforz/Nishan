import colors from 'colors';
import { UnsupportedPropertyTypeError } from '../libs';

it(`UnsupportedPropertyTypeError`, () => {
	expect(new UnsupportedPropertyTypeError('Name', [ 'arg', 'name' ], 'text', [ 'checkbox', 'number' ]).message).toBe(
		colors.bold.red(
			`Property Name referenced in arg.name is not of the supported types\nGiven type: text\nSupported types: checkbox | number`
		)
	);
});
