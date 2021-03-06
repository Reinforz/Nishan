import colors from 'colors';
import { NotionErrors } from '../libs';

it(`NonExistentDataError`, () => {
	expect(new NotionErrors.non_existent_data('collection', '123').message).toBe(
		colors.bold.red(`collection:123 doesn't exist`)
	);
});
