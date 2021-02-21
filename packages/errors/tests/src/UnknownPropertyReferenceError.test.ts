import { UnknownPropertyReferenceError } from '../../src/';

it(`UnknownPropertyReferenceError`, () => {
	expect(new UnknownPropertyReferenceError('Name', [ 'arg', 'name' ]).message).toBe(
		`Unknown property Name referenced in arg.name`
	);
});
