import { IPackageInfo, IPackageStatus } from '../components/App';

export const createPackagePublishOrder = (packages: IPackageInfo[]): Promise<IPackageStatus[]> => {
	return fetch('http://localhost:3000/createPackagePublishOrder', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(packages.filter(({ checked }) => checked).map(({ name }) => name))
	})
		.then((res) => res.json())
		.then((packages: string[]) =>
			packages.map((package_name) => ({
				name: package_name,
				steps: [
					{
						step: 'import_checker',
						done: false
					},
					{
						step: 'test',
						done: false
					},
					{
						step: 'transpile',
						done: false
					},
					{
						step: 'transpile_nocomments',
						done: false
					},
					{
						step: 'update_json',
						done: false
					},
					{
						step: 'publish',
						done: false
					}
				]
			}))
		);
};
