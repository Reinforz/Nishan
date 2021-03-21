import { TData } from '@nishans/types';

export const populateChildPath = <T extends TData>(arg: { data: T; child_path: keyof T; child_id: string }) => {
	const { data, child_id, child_path } = arg;
	if (!data[child_path]) data[child_path] = [ child_id ] as any;
	else (data[child_path] as any).push(child_id);
};
