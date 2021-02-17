import { Mutations, Queries } from '@nishans/endpoints';
import { NotionPermissions } from '../../src';
import { default_nishan_arg } from '../defaultNishanArg';

it(`addSharedUser`, async () => {
	const notion_permissions = new NotionPermissions(
		{
			...default_nishan_arg
		},
		'block_1',
		'block'
	);

	const notion_user_2 = { id: 'notion_user_2' };

	const queriesFindUserMock = jest.spyOn(Queries, 'findUser').mockImplementationOnce(async () => {
		return { value: { value: notion_user_2 } as any };
	});

	const mutationsInviteGuestsToSpace = jest
		.spyOn(Mutations, 'inviteGuestsToSpace')
		.mockImplementationOnce(async () => undefined);

	const notion_users = await notion_permissions.addUserPermission('devorein00@gmail.com', 'editor');
});
