export type IPackageInfo = {
	version: string;
	dependents: Record<string, string>;
	dependencies: Record<string, string>;
	name: string;
};

export type IPackageMap = Map<string, IPackageInfo>;
