import { createDependencyMap } from './createDependencyMap';
import { createDependencyVersionMap } from './createDependencyVersionMap';
import { createPackageDirectory } from './createPackageDirectory';
import { createPackageMap } from './createPackageMap';
import { createPackagePublishOrder } from './createPackagePublishOrder';
import { createPackagesData } from './createPackagesData';
import { createReadme } from './createReadme';

export const NishanScriptsCreate = {
	dependencyMap: createDependencyMap,
	dependencyVersionMap: createDependencyVersionMap,
	packageDirectory: createPackageDirectory,
	packageMap: createPackageMap,
	packagePublishOrder: createPackagePublishOrder,
	readme: createReadme,
	packagesData: createPackagesData
};
