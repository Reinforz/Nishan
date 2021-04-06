import { IPackageMap } from '../types';

export function updatePatchVersion (updated_package: string, package_map: IPackageMap, amount: number) {
	const package_info = package_map.get(updated_package)!;
	const [ major, minor, patch ] = package_info.version.split('.');
	package_info.version = `${major}.${minor}.${parseInt(patch) + amount}`;
	package_map.set(updated_package, package_info);
}
