import { NotionUtils } from '../libs';

it(`Should work correctly`, () => {
	expect(
		NotionUtils.setDefault(
			{
				info: {
					name: 'Shaheer'
				}
			},
			{
				info: {
					name: 'Safwan',
					age: 20
				}
			}
		)
	).toStrictEqual({
		info: { name: 'Shaheer', age: 20 }
	});
});

it(`Should work correctly if object key doesn't exist`, () => {
	expect(
		NotionUtils.setDefault(
			{},
			{
				info: {
					name: 'Safwan',
					age: 20
				}
			}
		)
	).toStrictEqual({
		info: {
			name: 'Safwan',
			age: 20
		}
	});
});
