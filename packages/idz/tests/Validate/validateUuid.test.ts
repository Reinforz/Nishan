import { NotionIdz } from '../../libs';

describe('NotionIdz.validateUuid', () => {
	it(`return true`, () => {
		expect(NotionIdz.Validate.uuid('d25d58cf-0ebc-436d-aecb-a1987fd9afab')).toBe(true);
	});

	it(`return false`, () => {
		expect(NotionIdz.Validate.uuid('d25d58cf-0ebc-436d-aecb-a1987fd9afa')).toBe(false);
	});
});
