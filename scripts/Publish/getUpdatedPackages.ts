import { IPackageMap } from '../types';
import { createPackageMap } from './createPackageMap';

export function getUpdatedPackages (updated_package_names: string[], packages_map: IPackageMap) {
	const updated_package_map: Map<string, string> = new Map();

	for (const updated_package_name of updated_package_names) {
		const package_map = packages_map.get(`@nishans/${updated_package_name}`);
		if (package_map) {
			updated_package_map.set(package_map.name, package_map.version);
			Object.entries(package_map.dependents).forEach(([ dependent_name, dependent_version ]) => {
				updated_package_map.set(dependent_name, dependent_version);
			});
		}
	}

	return updated_package_map;
}

createPackageMap().then((package_map) => console.log(getUpdatedPackages([ 'idz' ], package_map)));
