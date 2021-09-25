import { NishanScriptsCreate } from './Create';
import { NishanScriptsExtract } from './Extract';
import { NishanScriptsGet } from './Get';
import { NishanScriptsInstall } from './Install';
import { NishanScriptsPublish } from './Publish';
import { NishanScriptsUpdate } from './Update';

export const NishanScripts = {
  Get: NishanScriptsGet,
  Update: NishanScriptsUpdate,
  Publish: NishanScriptsPublish,
  Create: NishanScriptsCreate,
  Extract: NishanScriptsExtract,
  Install: NishanScriptsInstall
};
