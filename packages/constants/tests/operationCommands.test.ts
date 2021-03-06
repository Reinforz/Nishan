import { TOperationCommand } from '@nishans/types';
import { NotionConstants } from '../libs';

it('NotionConstants.operationCommands', () => {
	const operation_commands = NotionConstants.operationCommands();
	const operation_commands_map: Map<TOperationCommand, true> = new Map();
	operation_commands.forEach((operation_command) => operation_commands_map.set(operation_command, true));

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
		expect(operation_commands_map.get(expected_operation_command)).toBe(true)
	);
});
