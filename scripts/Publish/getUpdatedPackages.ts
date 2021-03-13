import { IPackageMap } from '../types';
import { createPackageMap } from './createPackageMap';

export function getUpdatedPackages (updated_package_names: string[], packages_map: IPackageMap) {
	const updated_package_map: Map<string, string> = new Map();

	for (const updated_package_name of updated_package_names) {
		const package_map = packages_map.get(`@nishans/${updated_package_name}`)!;
		updated_package_map.set(package_map.name, package_map.version);

		function traverse (dependents: Record<string, string>) {
			const left_dependent_entries = Object.entries(dependents).filter(
				([ dependent_name ]) => !updated_package_map.get(dependent_name)
			);

			left_dependent_entries.forEach(([ dependent_name, dependent_version ]) => {
				const left_dependent_map = packages_map.get(dependent_name)!;
				updated_package_map.set(dependent_name, dependent_version);
				traverse(left_dependent_map.dependents);
			});
		}

		traverse(package_map.dependents);
	}

	return updated_package_map;
}

createPackageMap().then((package_map) => console.log(getUpdatedPackages([ 'idz' ], package_map)));
