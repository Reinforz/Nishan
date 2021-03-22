import cp from 'child_process';
import path from 'path';
import { build } from 'tsc-prog';
import { NishanScripts } from '../';

async function testImports () {
	const root_dir = path.resolve(__dirname, '../../../../');
	await NishanScripts.Create.importedPackagesSourceFile();
	try {
		build({
			basePath: root_dir,
			compilerOptions: {
				declaration: false,
				removeComments: true,
				outDir: './dist',
				rootDir: './',
				esModuleInterop: true,
				module: 'commonjs',
				moduleResolution: 'node',
				target: 'esnext',
				strict: true,
				skipLibCheck: true,
				sourceMap: false
			},
			include: [ './test.ts' ]
		});
		cp.execSync('node test.js', { cwd: path.join(root_dir, 'dist') });
	} catch (err) {
		console.log(err.stdout.toString());
	}
}

testImports();
