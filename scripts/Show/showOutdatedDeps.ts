import { IPackageMap } from '../types';

export function showOutdatedDeps (package_map: IPackageMap) {
	const outdated_package_map: Map<string, Record<string, [string, string]>> = new Map();

	for (const [ package_name, { dependencies } ] of package_map) {
		const outdated_package_record: Record<string, [string, string]> = {};
		outdated_package_map.set(package_name, outdated_package_record);
		Object.entries(dependencies).forEach(([ dependency_name, dependency_version ]) => {
			outdated_package_record[dependency_name] = [ dependency_version, package_map.get(dependency_name)!.version ];
		});
	}

	return outdated_package_map;
}
