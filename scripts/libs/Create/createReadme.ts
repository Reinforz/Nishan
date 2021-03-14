import fs from 'fs';
import dedent from 'ts-dedent';

export const createReadme = async (
	package_readme_file_path: string,
	package_name: string,
	package_description: string
) => {
	await fs.promises.writeFile(
		package_readme_file_path,
		dedent`# <pre>@nishans/${package_name}</pre>
    
    <p align="center">
      <img width="125" src="https://github.com/Devorein/Nishan/blob/master/docs/static/img/${package_name}/logo.svg"/>
    </p>
    
    <p align="center">
      <img src="https://img.shields.io/bundlephobia/minzip/@nishans/${package_name}?label=minzipped&style=flat&color=%23bb0a1e"/>
      <img src="https://img.shields.io/npm/dw/@nishans/${package_name}?style=flat&color=orange"/>
      <img src="https://img.shields.io/github/issues/devorein/nishan/@nishans/${package_name}?color=yellow"/>
      <img src="https://img.shields.io/npm/v/@nishans/${package_name}?color=%2303C04A"/>
      <img src="https://img.shields.io/codecov/c/github/devorein/Nishan?flag=${package_name.replace(
				/\-/g,
				'_'
			)}&color=blue"/>
      <img src="https://img.shields.io/librariesio/release/npm/@nishans/${package_name}?color=%234B0082">
    </p>
    
    <p align="center">
      | <a href="https://github.com/Devorein/Nishan/tree/master/packages/${package_name}">Github</a> |
      <a href="https://nishan-docs.netlify.app/docs/${package_name}/">Docs</a> |
      <a href="https://www.npmjs.com/package/@nishans/${package_name}">NPM</a> |
      <a href="https://discord.com/invite/SpwHCz8ysx">Discord</a> |
    </p>
    
    <p align="center"><b>${package_description}</b></p>
    `,
		'utf-8'
	);
};
