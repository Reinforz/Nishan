import colors from 'colors';
import { NotionErrors } from '../libs';

it(`UnsupportedDataTypeError`, () => {
	expect(new NotionErrors.unsupported_data_type('notion_user', [ 'block', 'collection' ]).message).toBe(
		colors.bold.red(
			`Data type is not of the supported types\nGiven type: notion_user\nSupported types: block | collection`
		)
	);
});
