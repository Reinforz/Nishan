import { ICache, NotionCacheObject } from '@nishans/cache';
import { NotionQueries } from '@nishans/endpoints';
import { NotionOperationsObject } from '@nishans/operations';
import { NotionPermissions } from '../../libs';
import { default_nishan_arg, last_edited_props, o } from '../utils';

afterEach(() => {
	jest.restoreAllMocks();
});

it(`addUserPermission`, async () => {
	const notion_permissions = new NotionPermissions(default_nishan_arg, 'block_1', 'block');
	const updateUserPermissionsMock = jest
		.spyOn(NotionPermissions.prototype, 'updateUserPermissions')
		.mockImplementationOnce(async () => undefined);

	await notion_permissions.addUserPermission({ email: 'devorein00@gmail.com' }, 'editor');
	expect(updateUserPermissionsMock).toHaveBeenCalledTimes(1);
	expect(updateUserPermissionsMock.mock.calls[0][0]).toStrictEqual([ [ { email: 'devorein00@gmail.com' }, 'editor' ] ]);
});

it(`removeUserPermission`, async () => {
	const notion_permissions = new NotionPermissions(default_nishan_arg, 'block_1', 'block');

	const updateUserPermissionsMock = jest
		.spyOn(NotionPermissions.prototype, 'updateUserPermissions')
		.mockImplementationOnce(async () => undefined);

	await notion_permissions.removeUserPermission({ email: 'devorein00@gmail.com' });
	expect(updateUserPermissionsMock).toHaveBeenCalledTimes(1);
	expect(updateUserPermissionsMock.mock.calls[0][0]).toStrictEqual([ [ { email: 'devorein00@gmail.com' }, 'none' ] ]);
});

it('updateUserPermission', async () => {
	const block_1: any = { id: 'block_1', permissions: [] },
		cache: ICache = {
			...NotionCacheObject.createDefaultCache(),
			block: new Map([ [ 'block_1', block_1 ] ])
		},
		executeOperationsMock = jest
			.spyOn(NotionOperationsObject, 'executeOperations')
			.mockImplementationOnce(async () => undefined);

	const logger_spy = jest.fn();
	const notion_permissions = new NotionPermissions(
		{ ...default_nishan_arg, logger: logger_spy, cache, id: 'block_1' },
		'block_1',
		'block'
	);

	const updateUserPermissionArgs = { email: 'devorein00@gmail.com' };

	const getNotionUserIdFromEmailMock = jest
		.spyOn(NotionPermissions.prototype, 'getNotionUserIdFromEmail')
		.mockImplementationOnce(async () => 'notion_user_2');

	await notion_permissions.updateUserPermission(updateUserPermissionArgs, 'editor');

	expect(logger_spy).toHaveBeenCalledWith('UPDATE', 'block', 'block_1');
	expect(getNotionUserIdFromEmailMock.mock.calls[0][0]).toStrictEqual(updateUserPermissionArgs);
	expect(executeOperationsMock.mock.calls[0][0]).toStrictEqual([
		o.b.sp('block_1', [ 'permissions' ], { role: 'editor', type: 'user_permission', user_id: 'notion_user_2' }),
		o.b.u('block_1', [], last_edited_props)
	]);
});

describe('getNotionUserIdFromEmail', () => {
	it(`email is passed, notion_user exists`, async () => {
		const notion_user_2 = { id: 'notion_user_2' };
		const NotionQueriesFindUserMock = jest.spyOn(NotionQueries, 'findUser').mockImplementationOnce(async () => {
			return { value: { value: notion_user_2 } as any };
		});

		const notion_permissions = new NotionPermissions(default_nishan_arg, 'block_1', 'block');

		const notion_user_id = await notion_permissions.getNotionUserIdFromEmail({ email: 'devorein00@gmail.com' });

		expect(notion_user_id).toBe('notion_user_2');
		expect(NotionQueriesFindUserMock).toHaveBeenCalledTimes(1);
		expect(NotionQueriesFindUserMock.mock.calls[0][0]).toStrictEqual({ email: 'devorein00@gmail.com' });
	});

	it(`id is passed`, async () => {
		const notion_permissions = new NotionPermissions(default_nishan_arg, 'block_1', 'block');
		const notion_user_id = await notion_permissions.getNotionUserIdFromEmail({ id: 'notion_user_2' });

		expect(notion_user_id).toBe('notion_user_2');
	});

	it(`email is passed, notion_user doesnot exist`, async () => {
		const NotionQueriesFindUserMock = jest.spyOn(NotionQueries, 'findUser').mockImplementationOnce(async () => {
			return {};
		});

		const notion_permissions = new NotionPermissions(default_nishan_arg, 'block_1', 'block');

		await expect(notion_permissions.getNotionUserIdFromEmail({ email: 'devorein00@gmail.com' })).rejects.toThrow(
			`User does not have a notion account`
		);

		expect(NotionQueriesFindUserMock).toHaveBeenCalledTimes(1);
		expect(NotionQueriesFindUserMock.mock.calls[0][0]).toStrictEqual({ email: 'devorein00@gmail.com' });
	});
});

describe('updatePermissionsArray', () => {
	it(`role=none`, () => {
		const block_1: any = {
				id: 'block_1',
				permissions: [
					{
						role: 'editor',
						type: 'user_permission',
						user_id: 'notion_user_1'
					}
				]
			},
			cache: ICache = {
				...NotionCacheObject.createDefaultCache(),
				block: new Map([ [ 'block_1', block_1 ] ])
			};

		const notion_permissions = new NotionPermissions(
			{ ...default_nishan_arg, cache, id: 'block_1' },
			'block_1',
			'block'
		);

		const operation = notion_permissions.updatePermissionsArray('user_permission', { role: 'none' }, 'notion_user_1');

		expect(operation).toStrictEqual(
			o.b.sp('block_1', [ 'permissions' ], {
				type: 'user_permission',
				user_id: 'notion_user_1',
				role: 'none'
			})
		);
		expect(block_1.permissions).toStrictEqual([]);
	});

	it(`permissions doesn't exist,permission_type=user_permission`, () => {
		const block_1: any = {
				id: 'block_1',
				permissions: []
			},
			cache: ICache = {
				...NotionCacheObject.createDefaultCache(),
				block: new Map([ [ 'block_1', block_1 ] ])
			};

		const notion_permissions = new NotionPermissions(
			{ ...default_nishan_arg, cache, id: 'block_1' },
			'block_1',
			'block'
		);

		const operations = notion_permissions.updatePermissionsArray(
			'user_permission',
			{ role: 'editor' },
			'notion_user_1'
		);
		const permission = {
			type: 'user_permission',
			user_id: 'notion_user_1',
			role: 'editor'
		};
		expect(operations).toStrictEqual(o.b.sp('block_1', [ 'permissions' ], permission));
		expect(block_1.permissions).toStrictEqual([ permission ]);
	});

	it(`permissions update,permission_type=space_permission`, () => {
		const block_1: any = {
				id: 'block_1',
				permissions: [
					{
						type: 'space_permission',
						role: 'editor'
					}
				]
			},
			cache: ICache = {
				...NotionCacheObject.createDefaultCache(),
				block: new Map([ [ 'block_1', block_1 ] ])
			};

		const notion_permissions = new NotionPermissions(
			{ ...default_nishan_arg, cache, id: 'block_1' },
			'block_1',
			'block'
		);

		const operation = notion_permissions.updatePermissionsArray('space_permission', { role: 'comment_only' });
		const permission = {
			type: 'space_permission',
			role: 'comment_only'
		};
		expect(operation).toStrictEqual(o.b.sp('block_1', [ 'permissions' ], permission));
		expect(block_1.permissions).toStrictEqual([ permission ]);
	});

	it(`update permissions role`, () => {
		const block_1: any = {
				id: 'block_1',
				permissions: [
					{
						type: 'user_permission',
						user_id: 'notion_user_1',
						role: 'editor'
					}
				]
			},
			cache: ICache = {
				...NotionCacheObject.createDefaultCache(),
				block: new Map([ [ 'block_1', block_1 ] ])
			};

		const notion_permissions = new NotionPermissions(
			{ ...default_nishan_arg, cache, id: 'block_1' },
			'block_1',
			'block'
		);

		const permission = {
			type: 'user_permission',
			user_id: 'notion_user_1',
			role: 'read_and_write'
		};

		const operation = notion_permissions.updatePermissionsArray(
			'user_permission',
			{ role: 'read_and_write' },
			'notion_user_1'
		);
		expect(operation).toStrictEqual(o.b.sp('block_1', [ 'permissions' ], permission));
		expect(block_1.permissions).toStrictEqual([ permission ]);
	});
});

it(`addPublicPermission`, async () => {
	const notion_permissions = new NotionPermissions(default_nishan_arg, 'block_1', 'block');

	const updatePublicPermissionMock = jest
		.spyOn(NotionPermissions.prototype, 'updatePublicPermission')
		.mockImplementationOnce(async () => undefined);

	await notion_permissions.addPublicPermission({ role: 'read_and_write' });
	expect(updatePublicPermissionMock).toHaveBeenCalledWith({
		allow_duplicate: true,
		allow_search_engine_indexing: true,
		role: 'read_and_write'
	});
});

it(`updateNonUserSpecificPermission`, () => {
	const block_1: any = {
			id: 'block_1',
			permissions: []
		},
		cache: ICache = {
			...NotionCacheObject.createDefaultCache(),
			block: new Map([ [ 'block_1', block_1 ] ])
		},
		executeOperationsMock = jest
			.spyOn(NotionOperationsObject, 'executeOperations')
			.mockImplementationOnce(async () => undefined),
		logger = jest.fn();

	const notion_permissions = new NotionPermissions(
		{ ...default_nishan_arg, cache, id: 'block_1', logger },
		'block_1',
		'block'
	);

	notion_permissions.updateNonUserSpecificPermission('public_permission', { role: 'read_and_write' });

	expect(logger).toHaveBeenCalledWith('UPDATE', 'block', 'block_1');
	expect(executeOperationsMock.mock.calls[0][0]).toStrictEqual([
		o.b.sp('block_1', [ 'permissions' ], { type: 'public_permission', role: 'read_and_write' }),
		o.b.u('block_1', [], last_edited_props)
	]);
});

it(`updatePublicPermission`, async () => {
	const notion_permissions = new NotionPermissions(default_nishan_arg, 'block_1', 'block');

	const updateNonUserSpecificPermissionMock = jest
		.spyOn(NotionPermissions.prototype, 'updateNonUserSpecificPermission')
		.mockImplementationOnce(async () => undefined);

	await notion_permissions.updatePublicPermission({ role: 'comment_only' });
	expect(updateNonUserSpecificPermissionMock).toHaveBeenCalledWith('public_permission', {
		role: 'comment_only'
	});
});

it(`removePublicPermission`, async () => {
	const notion_permissions = new NotionPermissions(default_nishan_arg, 'block_1', 'block');

	const updatePublicPermissionMock = jest
		.spyOn(NotionPermissions.prototype, 'updatePublicPermission')
		.mockImplementationOnce(async () => undefined);

	await notion_permissions.removePublicPermission();
	expect(updatePublicPermissionMock).toHaveBeenCalledWith({
		role: 'none'
	});
});

it(`updateSpacePermission`, async () => {
	const notion_permissions = new NotionPermissions(default_nishan_arg, 'block_1', 'block');

	const updateNonUserSpecificPermissionMock = jest
		.spyOn(NotionPermissions.prototype, 'updateNonUserSpecificPermission')
		.mockImplementationOnce(async () => undefined);

	await notion_permissions.updateSpacePermission('comment_only');
	expect(updateNonUserSpecificPermissionMock).toHaveBeenCalledWith('space_permission', {
		role: 'comment_only'
	});
});

it(`removeSpacePermission`, async () => {
	const notion_permissions = new NotionPermissions(default_nishan_arg, 'block_1', 'block');

	const updateSpacePermissionMock = jest
		.spyOn(NotionPermissions.prototype, 'updateSpacePermission')
		.mockImplementationOnce(async () => undefined);

	await notion_permissions.removeSpacePermission();
	expect(updateSpacePermissionMock).toHaveBeenCalledWith('none');
});
