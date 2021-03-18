import { NishanScripts } from '../';
import packages_data from '../../packages.json';

export const updateOutdatedDeps = async () => {
	const outdated_dependency_map = await NishanScripts.Get.outdatedDeps();
	for (const { name } of packages_data) {
		await NishanScripts.Update.packageDependency(outdated_dependency_map, name);
	}
};
