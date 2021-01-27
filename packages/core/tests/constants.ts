import Nishan from '../src';
import data from './data';

import { generateTestData } from './utils/generateTestData';

const nishan = new Nishan({
	token: ''
});

nishan.logger = false;
nishan.init_cache = true;

nishan.saveToCache(data.recordMap);

const TEST_DATA = generateTestData();

export { data, TEST_DATA, nishan };
