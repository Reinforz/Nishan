export declare const NishanScriptsExtract: {
    dependencies: (dependencies: Record<string, string>) => Record<string, string>;
    packageDependencies: (package_name: string) => Promise<Map<string, string[]>>;
    moduleDependencies: (module_path: string) => Set<string>;
    packageInstalledDependencies: (package_name: string) => Promise<Map<string, string[]>>;
};
