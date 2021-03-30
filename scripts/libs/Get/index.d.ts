import { getOutdatedDeps } from './getOutdatedDeps';
export declare const NishanScriptsGet: {
    packageJsonDependencies: (package_name: string) => Promise<Record<string, string>>;
    packageNonInstalledDependencies: (package_name: string) => Promise<Map<string, string[]>>;
    packagesNonInstalledDependencies: () => Promise<Map<string, Map<string, string[]>>>;
    outdatedDeps: typeof getOutdatedDeps;
    packageJsonData: (package_name: string) => Promise<{
        package_json_data: any;
        package_json_path: string;
    }>;
};
