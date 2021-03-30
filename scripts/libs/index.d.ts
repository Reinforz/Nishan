export declare const NishanScripts: {
    Get: {
        packageJsonDependencies: (package_name: string) => Promise<Record<string, string>>;
        packageNonInstalledDependencies: (package_name: string) => Promise<Map<string, string[]>>;
        packagesNonInstalledDependencies: () => Promise<Map<string, Map<string, string[]>>>;
        outdatedDeps: typeof import("./Get/getOutdatedDeps").getOutdatedDeps;
        packageJsonData: (package_name: string) => Promise<{
            package_json_data: any;
            package_json_path: string;
        }>;
    };
    Build: {
        afterTest: typeof import("./Build/buildAfterTest").buildAfterTest;
        withoutComments: typeof import("./Build/buildWithoutComments").buildWithoutComments;
    };
    Update: {
        packageDescription: typeof import("./Update/updatePackageDescription").updatePackageDescription;
        packageDependency: typeof import("./Update/updatePackageDependency").updatePackageDependency;
        packageMetadata: typeof import("./Update/updatePackageMetadata").updatePackageMetadata;
        patchVersion: typeof import("./Update/updatePatchVersion").updatePatchVersion;
        outdatedDeps: () => Promise<void>;
    };
    Publish: {
        updatedPackages: typeof import("./Publish/publishUpdatedPackages").publishUpdatedPackages;
        packages: typeof import("./Publish/publishPackages").publishPackages;
    };
    Create: {
        dependencyMap: typeof import("./Create/createDependencyMap").createDependencyMap;
        dependencyVersionMap: typeof import("./Create/createDependencyVersionMap").createDependencyVersionMap;
        packageDirectory: typeof import("./Create/createPackageDirectory").createPackageDirectory;
        packageMap: typeof import("./Create/createPackageMap").createPackageMap;
        packagePublishOrder: typeof import("./Create/createPackagePublishOrder").createPackagePublishOrder;
        readme: (package_readme_file_path: string, package_name: string, package_description: string) => Promise<void>;
        packagesData: typeof import("./Create/createPackagesData").createPackagesData;
        importedPackagesSourceFile: typeof import("./Create/createImportedPackagesSourceFile").createImportedPackagesSourceFile;
    };
    Extract: {
        dependencies: (dependencies: Record<string, string>) => Record<string, string>;
        packageDependencies: (package_name: string) => Promise<Map<string, string[]>>;
        moduleDependencies: (module_path: string) => Set<string>;
        packageInstalledDependencies: (package_name: string) => Promise<Map<string, string[]>>;
    };
};
