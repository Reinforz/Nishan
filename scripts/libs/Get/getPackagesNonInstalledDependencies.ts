import colors from 'colors';
import { NishanScripts } from '../';
import packages_data from '../../packages.json';

export const getPackagesNonInstalledDependencies = async () => {
	const package_non_installed_dependencies_map: Map<string, Map<string, string[]>> = new Map();
	for (let index = 0; index < packages_data.length; index++) {
		const package_data = packages_data[index],
			package_name = package_data.name.split('/')[1],
			non_installed_dependencies = await NishanScripts.Get.packageNonInstalledDependencies(package_name);

		package_non_installed_dependencies_map.set(package_name, non_installed_dependencies);
		console.log(colors.red.bold(JSON.stringify(non_installed_dependencies, null, 2)));
	}
	return package_non_installed_dependencies_map;
};
