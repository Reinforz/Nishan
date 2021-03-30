import { IPackageInfo } from '../components/App';

export const getPackages = async (): Promise<IPackageInfo[]> => {
	const data = await fetch('http://localhost:3000/getPackages');
	const json_data = (await data.json()) as string[];
	return json_data.map((package_name) => ({ name: package_name, checked: false }));
};
