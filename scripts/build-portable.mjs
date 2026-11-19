// Bundle the existing React UI and API routes into a small Worker ESM artifact.
import {build} from '../node_modules/wrangler/node_modules/esbuild/lib/main.js';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
const client=await build({stdin:{contents:"import React from 'react';import{createRoot}from'react-dom/client';import App from './app/tree-app';createRoot(document.getElementById('root')).render(<App/>);",resolveDir:process.cwd(),loader:'tsx'},bundle:true,jsx:'automatic',write:false,minify:true,define:{'process.env.NODE_ENV':'"production"'}});
const js=client.outputFiles[0].text;
const css=readFileSync('app/tree.css','utf8').replace('@import "tailwindcss";','');
const icon=readFileSync('public/favicon.svg','utf8');
const html='<!doctype html><html lang="zh-CN"><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="自由出题，邀请朋友答题，把你们的默契挂上圣诞树。"><title>默契圣诞树 · 把懂你的人，挂在星光里</title><link rel="icon" href="/favicon.svg"><link rel="stylesheet" href="/style.css"><div id="root"></div><script defer src="/app.js"></script></html>';
await build({entryPoints:['worker/portable.ts'],bundle:true,format:'esm',target:'es2022',minify:true,outfile:'dist/server/index.js',external:['cloudflare:workers'],plugins:[{name:'tree-assets',setup(b){b.onResolve({filter:/^virtual:tree-ui$/},()=>({path:'ui',namespace:'assets'}));b.onLoad({filter:/.*/,namespace:'assets'},()=>({contents:Object.entries({js,css,icon,html}).map(([k,v])=>'export const '+k+'='+JSON.stringify(v)+';').join('\n')}));}}]});
mkdirSync('dist/.openai',{recursive:true});writeFileSync('dist/.openai/hosting.json',readFileSync('.openai/hosting.json'));
console.log('Built Worker with embedded UI and shared API routes.');
