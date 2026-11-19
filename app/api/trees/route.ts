import { env } from 'cloudflare:workers';
import { validateTree } from '@/lib/quiz.mjs';
export async function POST(req:Request) {
  try {
    if(Number(req.headers.get('content-length'))>30000) return Response.json({error:'题库内容过长'},{status:413});
    const data=validateTree(await req.json());
    const id=crypto.randomUUID().replaceAll('-','');
    await env.DB!.prepare('INSERT INTO trees (id, owner, title, intro, questions, created) VALUES (?, ?, ?, ?, ?, ?)').bind(id,data.owner,data.title,data.intro,JSON.stringify(data.questions),Date.now()).run();
    return Response.json({id},{status:201});
  } catch(e) {return Response.json({error:e instanceof Error && !e.message.includes('D1') ? e.message:'保存失败，请稍后再试'},{status:400});}
}
