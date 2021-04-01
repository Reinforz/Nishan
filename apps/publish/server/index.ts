import { NishanScripts } from '@nishans/scripts';
import cors from 'cors';
import express from 'express';
import fs from 'fs';
import path from 'path';
import WebSocket from 'ws';

const app = express();
app.use(express.json());
app.use(cors());

const wss = new WebSocket.Server({
	port: 8000
});

const ws_clients: WebSocket[] = [];

wss.on('connection', async (ws) => {
	console.log('New client connected');
	ws_clients.push(ws);
	ws.on('close', async () => {
		console.log('Client has disconnected');
	});
});

const port = 3000;

app.get('/getPackages', async (req, res) => {
	const packages = await fs.promises.readdir(path.resolve(__dirname, '../../../../packages'));
	res.send(packages);
});

app.post('/createPackagePublishOrder', async (req, res) => {
	const packages_map = await NishanScripts.Create.packageMap(),
		package_dependency_map = NishanScripts.Create.dependencyMap(req.body, packages_map),
		rearranged_packages = NishanScripts.Create.packagePublishOrder(
			Array.from(package_dependency_map.all.keys()),
			packages_map
		);
	res.send(rearranged_packages);
});

app.post('/publishPackages', async (req) => {
	await NishanScripts.Build.afterTest(req.body, false, (name, step) =>
		ws_clients.forEach((ws_client) =>
			ws_client.send(
				JSON.stringify({
					name,
					step
				})
			)
		)
	);
});

app.get('/resumePackagePublishing', async () => {
	await NishanScripts.Build.afterTest([], true, (name, step) =>
		ws_clients.forEach((ws_client) =>
			ws_client.send(
				JSON.stringify({
					type: 'package_step',
					data: {
						name,
						step
					}
				})
			)
		)
	);
});

app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});
