import { NotionIdz } from '../../libs';

describe('NotionIdz.validateId', () => {
	it(`return true`, () => {
		expect(NotionIdz.Validate.id('d25d58cf0ebc436daecba1987fd9afab')).toBe(true);
	});

	it(`return false`, () => {
		expect(NotionIdz.Validate.id('d25d58cf0ebc436daecba1987fd9afa')).toBe(false);
	});
});
