import colors from 'colors';
import { NotionErrors } from '../libs';

it(`UnknownPropertyReferenceError`, () => {
	expect(new NotionErrors.unknown_property_reference('Name', [ 'arg', 'name' ]).message).toBe(
		colors.bold.red(`Unknown property Name referenced in arg.name`)
	);
});
