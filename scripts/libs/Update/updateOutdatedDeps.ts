import { NishanScripts } from '../';

export const updateOutdatedDeps = async () => {
	const outdated_dependency_map = await NishanScripts.Get.outdatedDeps();
	for (const [ package_name ] of outdated_dependency_map) {
		await NishanScripts.Update.packageDependency(outdated_dependency_map, package_name);
	}
};
