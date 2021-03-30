import { IPackageMap } from '../types';

export function createPackagePublishOrder (updated_packages: string[], packages_map: IPackageMap) {
	const package_publish_order = updated_packages
		.sort((updated_package_a, updated_package_b) => {
			const package_a_map = packages_map.get(updated_package_a)!,
				package_b_map = packages_map.get(updated_package_b)!;
			if (package_a_map.dependents[`${updated_package_b}`]) return 1;
			else if (package_b_map.dependents[`${updated_package_a}`]) return -1;
			else return 0;
		})
		.reduce((arr, rearranged_package) => [ ...arr, rearranged_package ], [] as string[])
		.reverse();

	return package_publish_order;
}
