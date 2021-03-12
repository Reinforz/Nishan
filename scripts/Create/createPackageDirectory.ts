import colors from 'colors';
import fs from 'fs';
import path from 'path';
import dedent from 'ts-dedent';
import { createReadme } from './createReadme';

async function main () {
	const [ package_name ] = process.argv.slice(2);

	const packages_dir_path = path.resolve(__dirname, '../../packages'),
		package_root_dir_path = path.join(packages_dir_path, package_name),
		package_tests_dir_path = path.join(package_root_dir_path, 'tests'),
		package_libs_dir_path = path.join(package_root_dir_path, 'libs');

	const package_tsconfig_file_path = path.join(package_root_dir_path, 'tsconfig.json'),
		package_packagejson_file_path = path.join(package_root_dir_path, 'package.json'),
		package_lib_index_file_path = path.join(package_libs_dir_path, 'index.ts'),
		package_readme_file_path = path.join(package_root_dir_path, 'readme.md'),
		package_experiment_dir_path = path.join(package_root_dir_path, 'experiment'),
		package_text_index_file_path = path.join(package_tests_dir_path, 'index.test.ts');

	await fs.promises.mkdir(package_root_dir_path);
	await fs.promises.mkdir(package_tests_dir_path);
	await fs.promises.mkdir(package_libs_dir_path);
	await fs.promises.mkdir(package_experiment_dir_path);

	await fs.promises.writeFile(
		package_text_index_file_path,
		dedent`it('Should Work', () => {
      expect(true).toBe(true);
    });
    `,
		'utf-8'
	);
	await fs.promises.writeFile(
		package_tsconfig_file_path,
		dedent`{
      "extends": "../../tsconfig.shared.json",
      "include": [
        "./libs/index.ts",
        "./experiment",
        "./examples"
      ],
      "compilerOptions": {
        "outDir": "./dist",
        "rootDir": "./",
      },
    }`,
		'utf-8'
	);
	await fs.promises.writeFile(
		package_packagejson_file_path,
		dedent`{
      "name": "@nishans/${package_name}",
      "version": "0.0.0",
      "description": "",
      "keywords": [],
      "author": "Safwan Shaheer <devorein00@gmail.com>",
      "homepage": "https://github.com/Devorein/Nishan/blob/master/packages/${package_name}/README.md",
      "license": "MIT",
      "main": "dist/libs/index.js",
      "typings": "dist/libs/index.d.ts",
      "directories": {
        "lib": "libs",
        "test": "tests"
      },
      "files": [
        "dist/libs"
      ],
      "repository": {
        "type": "git",
        "url": "git+https://github.com/Devorein/Nishan.git"
      },
      "scripts": {
        "prepublishOnly": "npm run build && npm run build:nocomments",
        "prebuild": "npm run test",
        "build": "npx del-cli ./dist && tsc --sourceMap false",
        "test": "npx jest --runInBand --config ../../jest.config.js",
        "build:nocomments": "tsc --sourceMap false --removeComments --declaration false"
      },
      "publishConfig": {
        "access": "public"
      },
      "bugs": {
        "url": "https://github.com/Devorein/Nishan/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc+label%3A%40nishans%2F${package_name}"
      },
      "dependencies": {},
      "devDependencies": {
        "@nishans/types": "^0.0.0"
      }
    }`,
		'utf-8'
	);
	await fs.promises.writeFile(package_lib_index_file_path, ``, 'utf-8');
	createReadme(package_readme_file_path, package_name);
	console.log(colors.green.bold(`Created package ${package_name}`));
}

main();
