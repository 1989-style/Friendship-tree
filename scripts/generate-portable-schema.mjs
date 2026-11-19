import {buildSync} from '../node_modules/wrangler/node_modules/esbuild/lib/main.js';
import {writeFileSync} from 'node:fs';
buildSync({entryPoints:['db/schema.ts'],bundle:true,platform:'node',format:'cjs',external:['drizzle-orm/*'],outfile:'.sites-runtime/schema.cjs'});
writeFileSync('.sites-runtime/drizzle.config.cjs',"module.exports={out:'./drizzle',schema:'./.sites-runtime/schema.cjs',dialect:'sqlite'};");
