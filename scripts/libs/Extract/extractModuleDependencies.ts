import ts from 'typescript';

export const extractModuleDependencies = (module_path: string) => {
	const program = ts.createProgram([ module_path ], { allowJs: true }),
		sourceFile = program.getSourceFile(module_path)!,
		imported_module_dependencies: Set<string> = new Set();
	(sourceFile as any).imports.forEach((node: any) => {
		imported_module_dependencies.add(node.text);
	});

	return imported_module_dependencies;
};
