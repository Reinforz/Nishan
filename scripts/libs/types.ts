export type IPackageInfo = {
	version: string;
	dependents: Record<string, string>;
	dependencies: Record<string, string>;
	name: string;
	description: string;
	published: boolean;
};

export type IPackageMap = Map<string, IPackageInfo>;
export interface IPackageDependencyMap {
	main: Map<string, string>;
	direct: Map<string, string>;
	indirect: Map<string, string>;
	all: Map<string, string>;
}

export type IPackageDependencyVersionMap = Map<string, Map<string, [string, string]>>;
