import { NishanScripts } from '../';
import { IPackageDependencyVersionMap } from '../types';

export async function getOutdatedDeps () {
	const package_map = await NishanScripts.Create.packageMap(),
		outdated_dependency_map: IPackageDependencyVersionMap = new Map();
	for (const [ package_name, { dependencies } ] of package_map) {
		Object.entries(dependencies).forEach(([ dependency_name, dependency_version ]) => {
			const dependency_map: Map<string, [string, string]> = new Map();
			const dependency_info = package_map.get(dependency_name)!;
			if (dependency_version.replace(/(\^|~)/g, '') !== dependency_info.version.replace(/(\^|~)/g, ''))
				dependency_map.set(dependency_name, [ dependency_version, dependency_info.version ]);
			if (dependency_map.size !== 0) outdated_dependency_map.set(package_name, dependency_map);
		});
	}
	return outdated_dependency_map;
}
