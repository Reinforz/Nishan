import { NishanScriptsBuild } from './Build';
import { NishanScriptsCreate } from './Create';
import { NishanScriptsExtract } from './Extract';
import { NishanScriptsGet } from './Get';
import { NishanScriptsPublish } from './Publish';
import { NishanScriptsShow } from './Show';
import { NishanScriptsUpdate } from './Update';

export const NishanScripts = {
	Show: NishanScriptsShow,
	Get: NishanScriptsGet,
	Build: NishanScriptsBuild,
	Update: NishanScriptsUpdate,
	Publish: NishanScriptsPublish,
	Create: NishanScriptsCreate,
	Extract: NishanScriptsExtract
};
