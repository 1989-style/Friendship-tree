import { env } from 'cloudflare:workers';
import { grade } from '@/lib/quiz.mjs';
type Ctx={params:Promise<{id:string}>};
export async function GET(req:Request,ctx:Ctx) {
  const {id}=await ctx.params;
  const tree=await env.DB!.prepare('SELECT * FROM trees WHERE id = ?').bind(id).first<any>();
  if(!tree) return Response.json({error:'这棵树不存在，请检查分享链接'},{status:404});
  const results=await env.DB!.prepare('SELECT id, name, score, total, created FROM attempts WHERE tree_id = ? ORDER BY score DESC, created ASC LIMIT 100').bind(id).all();
  return Response.json({...tree,questions:JSON.parse(tree.questions).map(({text,options}:any)=>({text,options})),results:results.results},{headers:{'Cache-Control':'no-store'}});
}
export async function POST(req:Request,ctx:Ctx) {
  const {id}=await ctx.params;
  try {
    const data=await req.json();
    if(typeof data.name!=='string'||!data.name.trim()||data.name.trim().length>24) throw Error('请输入 1～24 字的昵称');
    if(typeof data.player!=='string'||!/^[a-zA-Z0-9-]{10,64}$/.test(data.player)) throw Error('答题标识无效，请刷新后重试');
    const tree=await env.DB!.prepare('SELECT questions FROM trees WHERE id = ?').bind(id).first<{questions:string}>();
    if(!tree) return Response.json({error:'这棵树不存在'},{status:404});
    const questions=JSON.parse(tree.questions), score=grade(questions,data.answers);
    const attemptId=id+'_'+data.player;
    await env.DB!.prepare('INSERT INTO attempts (id, tree_id, name, score, total, created) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO NOTHING').bind(attemptId,id,data.name.trim(),score,questions.length,Date.now()).run();
    const saved=await env.DB!.prepare('SELECT name,score,total FROM attempts WHERE id = ?').bind(attemptId).first();
    return Response.json(saved);
  } catch(e) {return Response.json({error:e instanceof Error && !e.message.includes('D1')?e.message:'提交失败，请重试'},{status:400});}
}
