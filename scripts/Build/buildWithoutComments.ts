import path from 'path';
import { build } from 'tsc-prog';

export function buildWithoutComments (package_name: string) {
	const ROOT_PACKAGE_DIR = path.resolve(__dirname, '../../packages');
	const PACKAGE_DIR = path.join(ROOT_PACKAGE_DIR, package_name);
	build({
		basePath: PACKAGE_DIR,
		configFilePath: path.join(PACKAGE_DIR, 'tsconfig.json'),
		compilerOptions: {
			declaration: false,
			removeComments: true,
			outDir: './dist',
			rootDir: './'
		}
	});
}
