import { createDependencyMap } from './createDependencyMap';
import { createDependencyVersionMap } from './createDependencyVersionMap';
import { createImportedPackagesSourceFile } from './createImportedPackagesSourceFile';
import { createPackageDirectory } from './createPackageDirectory';
import { createPackageMap } from './createPackageMap';
import { createPackagePublishOrder } from './createPackagePublishOrder';
import { createPackagesData } from './createPackagesData';
export declare const NishanScriptsCreate: {
    dependencyMap: typeof createDependencyMap;
    dependencyVersionMap: typeof createDependencyVersionMap;
    packageDirectory: typeof createPackageDirectory;
    packageMap: typeof createPackageMap;
    packagePublishOrder: typeof createPackagePublishOrder;
    readme: (package_readme_file_path: string, package_name: string, package_description: string) => Promise<void>;
    packagesData: typeof createPackagesData;
    importedPackagesSourceFile: typeof createImportedPackagesSourceFile;
};
