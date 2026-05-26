import { join } from 'path';

import * as moduleAlias from 'module-alias';

moduleAlias.addAlias('@', join(__dirname, '..'));