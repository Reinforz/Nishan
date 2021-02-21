import { UnsupportedDataTypeError } from '../../src/';

it(`UnsupportedDataTypeError`, () => {
	expect(new UnsupportedDataTypeError('notion_user', [ 'block', 'collection' ]).message).toBe(
		`Data type is not of the supported types\nGiven type: notion_user\nSupported types: block | collection`
	);
});
