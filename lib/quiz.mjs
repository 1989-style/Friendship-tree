export function validateTree(value) {
  if (!value || typeof value !== 'object') throw Error('请填写树的资料');
  const clean = (v, max, label) => { if(typeof v !== 'string' || !v.trim() || v.trim().length > max) throw Error(`${label}不能为空，且不能超过 ${max} 字`); return v.trim(); };
  const owner=clean(value.owner,24,'昵称'), title=clean(value.title,50,'标题');
  if(!Array.isArray(value.questions) || value.questions.length < 1 || value.questions.length > 20) throw Error('请设置 1～20 道题');
  const questions=value.questions.map(q=>{
    const text=clean(q?.text,160,'题目');
    if(!Array.isArray(q.options) || q.options.length<2 || q.options.length>6) throw Error('每题需有 2～6 个选项');
    const options=q.options.map(o=>clean(o,80,'选项'));
    if(new Set(options).size !== options.length) throw Error('同一道题的选项不能重复');
    if(!Number.isInteger(q.correct) || q.correct<0 || q.correct>=options.length) throw Error('请选择正确答案');
    return {text,options,correct:q.correct};
  });
  return {owner,title,intro:typeof value.intro==='string'?value.intro.trim().slice(0,160):'',questions};
}
export function grade(questions,answers) {
  if(!Array.isArray(answers) || answers.length !== questions.length || answers.some((a,i)=>!Number.isInteger(a)||a<0||a>=questions[i].options.length)) throw Error('请答完所有题目');
  return questions.reduce((n,q,i)=>n+Number(q.correct===answers[i]),0);
}
