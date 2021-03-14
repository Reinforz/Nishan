import { IPackageDependencyMap, IPackageMap } from '../types';

export function createDependencyMap (package_names: string[], packages_map: IPackageMap) {
	const package_dependency_map: IPackageDependencyMap = {
		main: new Map(),
		direct: new Map(),
		indirect: new Map(),
		all: new Map()
	};

	for (const package_name of package_names) {
		const package_map = packages_map.get(`@nishans/${package_name}`)!;
		package_dependency_map.main.set(package_map.name, package_map.version);
		package_dependency_map.all.set(package_map.name, package_map.version);

		function traverse (dependents: Record<string, string>, level: number) {
			Object.entries(dependents)
				.filter(([ dependent_name ]) => !package_dependency_map.all.get(dependent_name))
				.forEach(([ dependent_name, dependent_version ]) => {
					if (dependent_version !== '0.0.0') {
						package_dependency_map.all.set(dependent_name, dependent_version);
						if (level === 0) package_dependency_map.direct.set(dependent_name, dependent_version);
						else package_dependency_map.indirect.set(dependent_name, dependent_version);
						traverse(packages_map.get(dependent_name)!.dependents, level + 1);
					}
				});
		}

		traverse(package_map.dependents, 0);
	}

	return package_dependency_map;
}
