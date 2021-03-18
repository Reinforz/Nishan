import colors from 'colors';
import { NishanScripts } from '..';

export async function getOutdatedDeps () {
	const package_map = await NishanScripts.Create.packageMap();
	for (const [ package_name, { dependencies } ] of package_map) {
		Object.entries(dependencies).forEach(([ dependency_name, dependency_version ]) => {
			const dependency_map = package_map.get(dependency_name)!;
			if (dependency_version.replace(/(\^|~)/g, '') !== dependency_map.version.replace(/(\^|~)/g, ''))
				console.log(
					colors.green(package_name) +
						' ' +
						colors.green.bold(dependency_name) +
						' ' +
						colors.blue(dependency_version) +
						' ' +
						colors.blue.bold(dependency_map.version)
				);
		});
	}
}
