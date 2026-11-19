import {POST as create} from '../app/api/trees/route';
import {GET as get,POST as submit} from '../app/api/trees/[id]/route';
import {html,js,css,icon} from 'virtual:tree-ui';
export default {async fetch(request:Request){
 const url=new URL(request.url);
 try {
  if(url.pathname==='/api/trees'&&request.method==='POST')return await create(request);
  const match=url.pathname.match(/^\/api\/trees\/([a-zA-Z0-9_-]+)$/);
  if(match){const ctx={params:Promise.resolve({id:match[1]})};if(request.method==='GET')return await get(request,ctx);if(request.method==='POST')return await submit(request,ctx);}
  if(url.pathname.startsWith('/api/'))return Response.json({error:'页面不存在'},{status:404});
  if(request.method!=='GET'&&request.method!=='HEAD')return new Response('Method not allowed',{status:405});
  const asset=url.pathname==='/app.js'?{body:js,type:'text/javascript; charset=utf-8'}:url.pathname==='/style.css'?{body:css,type:'text/css; charset=utf-8'}:url.pathname==='/favicon.svg'?{body:icon,type:'image/svg+xml'}:{body:html,type:'text/html; charset=utf-8'};
  return new Response(request.method==='HEAD'?null:asset.body,{headers:{'Content-Type':asset.type,'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff','Referrer-Policy':'same-origin'}});
 }catch{return Response.json({error:'服务暂时不可用，请稍后重试'},{status:503});}
}};
