import '../env';
import step1 from './step_1';
import step2 from './step_2';
import step3 from './step_3';
import step4 from './step_4';

(async function () {
	// Pass your own user family name and space name to get the correct user and space instance
	const target_page = await step1('Shaheer', "Safwan's Notion");
	await step2(target_page);
	await step3(target_page);
	await step4(target_page);
})();
