import colors from 'colors';
import { UnknownPropertyReferenceError } from '../../src/';

it(`UnknownPropertyReferenceError`, () => {
	expect(new UnknownPropertyReferenceError('Name', [ 'arg', 'name' ]).message).toBe(
		colors.bold.red(`Unknown property Name referenced in arg.name`)
	);
});
