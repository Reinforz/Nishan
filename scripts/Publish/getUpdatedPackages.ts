import { IPackageMap } from '../types';
import { createPackageMap } from './createPackageMap';

export function getUpdatedPackages (updated_package_names: string[], packages_map: IPackageMap) {
	const updated_package_map: {
		starter: Map<string, string>;
		direct: Map<string, string>;
		indirect: Map<string, string>;
		all: Map<string, string>;
	} = {
		starter: new Map(),
		direct: new Map(),
		indirect: new Map(),
		all: new Map()
	};

	for (const updated_package_name of updated_package_names) {
		const package_map = packages_map.get(`@nishans/${updated_package_name}`)!;
		updated_package_map.starter.set(package_map.name, package_map.version);
		updated_package_map.all.set(package_map.name, package_map.version);

		function traverse (dependents: Record<string, string>, level: number) {
			Object.entries(dependents)
				.filter(([ dependent_name ]) => !updated_package_map.all.get(dependent_name))
				.forEach(([ dependent_name, dependent_version ]) => {
					updated_package_map.all.set(dependent_name, dependent_version);
					if (level === 0) updated_package_map.direct.set(dependent_name, dependent_version);
					else updated_package_map.indirect.set(dependent_name, dependent_version);
					traverse(packages_map.get(dependent_name)!.dependents, level + 1);
				});
		}

		traverse(package_map.dependents, 0);
	}

	return updated_package_map;
}

createPackageMap().then((package_map) => console.log(getUpdatedPackages([ 'idz' ], package_map)));
