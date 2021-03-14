import { createDependencyMap } from './createDependencyMap';
import { createDependencyVersionMap } from './createDependencyVersionMap';
import { createOrderedPackage } from './createOrderedPackage';
import { createPackageDirectory } from './createPackageDirectory';
import { createPackageMap } from './createPackageMap';
import { createPackagesData } from './createPackagesData';
import { createReadme } from './createReadme';

export const NishanScriptsCreate = {
	dependencyMap: createDependencyMap,
	dependencyVersionMap: createDependencyVersionMap,
	packageDirectory: createPackageDirectory,
	packageMap: createPackageMap,
	orderedPackage: createOrderedPackage,
	readme: createReadme,
	packagesData: createPackagesData
};
