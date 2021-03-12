export const trimDependencies = (dependencies: Record<string, string>) => {
	const trimmed_dependencies: Record<string, string> = {};
	Object.keys(dependencies).forEach((dependency) => {
		if (dependency.startsWith('@nishans')) trimmed_dependencies[dependency] = dependencies[dependency];
	});

	return trimmed_dependencies;
};
