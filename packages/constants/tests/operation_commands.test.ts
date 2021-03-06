import { TOperationCommand } from '@nishans/types';
import { NotionConstants } from '../libs';

it('NotionConstants.data_types', () => {
	const operation_commands = NotionConstants.operation_commands();
	const expected_operation_commands: TOperationCommand[] = [
		'setPermissionItem',
		'listRemove',
		'listBefore',
		'listAfter',
		'update',
		'set'
	];

	expect(operation_commands.length === expected_operation_commands.length).toBe(true);
	expected_operation_commands.forEach((expected_operation_command) =>
		expect(operation_commands.includes(expected_operation_command)).toBe(true)
	);
});
