import { IPackageMap } from '../types';

export function updatePatchVersion (updated_packages: string[], package_map: IPackageMap, amount: number) {
	const updated_packages_map: Map<string, string> = new Map();
	updated_packages.forEach((updated_package_name) => {
		const [ major, minor, patch ] = package_map.get(updated_package_name)!.version.split('.');
		updated_packages_map.set(updated_package_name, `${major}.${minor}.${parseInt(patch) + amount}`);
	});

	return updated_packages_map;
}
