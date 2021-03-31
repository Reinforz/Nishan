export const publishPackages = async (packages: string[]) => {
	return fetch('http://localhost:3000/publishPackages', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(packages)
	});
};
