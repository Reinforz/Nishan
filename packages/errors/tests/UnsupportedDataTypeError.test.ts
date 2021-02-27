import colors from 'colors';
import { UnsupportedDataTypeError } from '../libs';

it(`UnsupportedDataTypeError`, () => {
	expect(new UnsupportedDataTypeError('notion_user', [ 'block', 'collection' ]).message).toBe(
		colors.bold.red(
			`Data type is not of the supported types\nGiven type: notion_user\nSupported types: block | collection`
		)
	);
});
