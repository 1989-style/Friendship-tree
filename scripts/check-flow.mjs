import assert from 'node:assert/strict';
const origin=process.argv[2]||'http://127.0.0.1:5173';
async function request(path,body){const response=await fetch(origin+path,body?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}:undefined);return {status:response.status,data:await response.json()};}
const draft={owner:'功能验证',title:'自定义题库验证',intro:'本地功能验证',questions:[{text:'第一题自定义',options:['选项甲','选项乙'],correct:1},{text:'第二题自定义',options:['选项丙','选项丁','选项戊'],correct:2}]};
const created=await request('/api/trees',draft);assert.equal(created.status,201,JSON.stringify(created.data));
const path='/api/trees/'+created.data.id;
const loaded=await request(path);assert.equal(loaded.data.title,draft.title);assert.equal(loaded.data.questions.length,2);assert.ok(!JSON.stringify(loaded.data).includes('correct'));assert.deepEqual(loaded.data.questions[1].options,draft.questions[1].options);
const player=crypto.randomUUID();
const incomplete=await request(path,{player,name:'访客',answers:[1]});assert.equal(incomplete.status,400);
const answer=await request(path,{player,name:'访客',answers:[1,0]});assert.equal(answer.status,200);assert.equal(answer.data.score,1);assert.equal(answer.data.total,2);
const repeat=await request(path,{player,name:'再次提交',answers:[1,2]});assert.equal(repeat.data.score,1);assert.equal(repeat.data.name,'访客');
const persisted=await request(path);assert.equal(persisted.data.results.length,1);assert.equal(persisted.data.results[0].score,1);
const missing=await request('/api/trees/nonexistent-tree');assert.equal(missing.status,404);
console.log('PASS: custom creation, invitation without answer disclosure, server scoring, persistence, duplicate protection, invalid submissions and missing links');
