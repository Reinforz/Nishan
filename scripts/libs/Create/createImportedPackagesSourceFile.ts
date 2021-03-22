import fs from 'fs';
import path from 'path';
import ts from 'typescript';
import packages_data from '../../packages.json';

export async function createImportedPackagesSourceFile () {
	const import_declarations: ts.ExportDeclaration[] = [];
	const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

	packages_data.forEach((package_data) => {
		if (package_data.published) {
			/* const package_name_chunks = package_data.name.split('/')[1].split('-');
			const package_import_identifier =
				'Nishan' +
				package_name_chunks
					.map((package_name_chunk) => package_name_chunk.charAt(0).toUpperCase() + package_name_chunk.substr(1))
					.join(''); */
			if (package_data.name !== '@nishans/types')
				import_declarations.push(
					ts.factory.createExportDeclaration(
						undefined,
						undefined,
						false,
						ts.factory.createIdentifier('*') as any,
						ts.factory.createStringLiteral(package_data.name)
					)
				);
		}
	});

	const temp_file = ts.createSourceFile('someFileName.ts', '', ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);
	await fs.promises.writeFile(
		path.join(path.resolve(__dirname, '../../../../'), 'test.ts'),
		printer.printList(ts.ListFormat.PreferNewLine, ts.factory.createNodeArray(import_declarations), temp_file)
	);
}

createImportedPackagesSourceFile();
