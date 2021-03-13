import { IPackageMap } from '../types';

export function rearrangePackageOrder (updated_packages_map: Map<string, string>, packages_map: IPackageMap) {
	const rearranged_packages = Array.from(updated_packages_map.keys()).sort((updated_package_a, updated_package_b) => {
		const package_a_map = packages_map.get(updated_package_a)!,
			package_b_map = packages_map.get(updated_package_b)!;
		if (package_a_map.dependents[`${updated_package_b}`]) return -1;
		else if (package_b_map.dependents[`${updated_package_a}`]) return 1;
		else return 0;
	});

	const rearranged_package_map: Map<string, string> = new Map();
	rearranged_packages.forEach((rearranged_package) =>
		rearranged_package_map.set(rearranged_package, packages_map.get(rearranged_package)!.version)
	);
	return rearranged_package_map;
}
