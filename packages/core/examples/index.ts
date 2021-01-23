import './env';
import workflow1 from './workflow_1';
import workflow2 from './workflow_2';
import workflow3 from './workflow_3';
import workflow4 from './workflow_4';

(async function () {
	// Pass your own user family name and space name to get the correct user and space instance
	const target_page = await workflow1('Shaheer', "Safwan's Notion");
	await workflow2(target_page);
	await workflow3(target_page);
	await workflow4(target_page);
})();
