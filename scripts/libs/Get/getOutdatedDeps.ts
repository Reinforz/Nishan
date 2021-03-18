import { NishanScripts } from '../';

export async function getOutdatedDeps () {
	const package_map = await NishanScripts.Create.packageMap(),
		outdated_dependency_map: Map<string, string> = new Map();
	for (const [ , { dependencies } ] of package_map) {
		Object.entries(dependencies).forEach(([ dependency_name, dependency_version ]) => {
			const dependency_info = package_map.get(dependency_name)!;
			if (dependency_version.replace(/(\^|~)/g, '') !== dependency_info.version.replace(/(\^|~)/g, ''))
				outdated_dependency_map.set(dependency_name, dependency_info.version);
		});
	}
	return outdated_dependency_map;
}
