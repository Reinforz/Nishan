import colors from 'colors';
import { NotionErrors } from '../libs';

it(`UnsupportedFunctionNameError`, () => {
	expect(new NotionErrors.unsupported_function_name('notion_user', [ 'max', 'min' ]).message).toBe(
		colors.bold.red(`Function is not supported.\nGiven function: notion_user\nSupported functions: max | min`)
	);
});
