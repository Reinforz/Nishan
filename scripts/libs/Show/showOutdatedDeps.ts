import colors from 'colors';
import { IPackageDependencyVersionMap } from '../types';

export function showOutdatedDeps (package_dependency_version_map: IPackageDependencyVersionMap) {
	for (const [ package_name, dependency_version_map ] of package_dependency_version_map) {
		for (const [ dependency_name, [ current_version, latest_version ] ] of dependency_version_map) {
			if (current_version.replace(/(\^|~)/g, '') !== latest_version)
				console.log(
					colors.green(package_name) +
						' ' +
						colors.green.bold(dependency_name) +
						' ' +
						colors.blue(current_version) +
						' ' +
						colors.blue.bold(latest_version)
				);
		}
	}
}
