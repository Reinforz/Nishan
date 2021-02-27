import colors from 'colors';
import { UnsupportedBlockTypeError } from '../libs';

it(`UnsupportedBlockTypeError`, () => {
	expect(new UnsupportedBlockTypeError('notion_user', [ 'to_do', 'header' ]).message).toBe(
		colors.bold.red(
			`Block type is not of the supported types\nGiven type: notion_user\nSupported types: to_do | header`
		)
	);
});
