import { IPackageDependencyVersionMap, IPackageMap } from '../types';

export function createDependencyVersionMap (package_map: IPackageMap) {
	const package_dependency_version_map: IPackageDependencyVersionMap = new Map();

	for (const [ package_name, { dependencies } ] of package_map) {
		const dependency_version_map: Map<string, [string, string]> = new Map();
		package_dependency_version_map.set(package_name, dependency_version_map);
		Object.entries(dependencies).forEach(([ dependency_name, dependency_version ]) => {
			dependency_version_map.set(dependency_name, [ dependency_version, package_map.get(dependency_name)!.version ]);
		});
	}

	return package_dependency_version_map;
}
