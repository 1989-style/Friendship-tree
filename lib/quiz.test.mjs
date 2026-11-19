import test from 'node:test';
import assert from 'node:assert/strict';
import {validateTree,grade} from './quiz.mjs';
const draft={owner:'小鹿',title:'我的树',questions:[{text:'喜欢哪个季节？',options:['春天','冬天'],correct:1}]};
test('custom answers are preserved and graded on the server',()=>{const d=validateTree(draft);assert.equal(d.questions[0].correct,1);assert.equal(grade(d.questions,[1]),1);assert.equal(grade(d.questions,[0]),0);});
test('invalid and incomplete submissions are rejected',()=>{for(const answers of [[],[2],[-1],[null],['1'],[1,0]])assert.throws(()=>grade(draft.questions,answers));});
test('question validation rejects ambiguous or missing options',()=>{assert.throws(()=>validateTree({...draft,owner:''}));assert.throws(()=>validateTree({...draft,questions:[]}));assert.throws(()=>validateTree({...draft,questions:[{...draft.questions[0],options:['a',' a ']}]}));assert.throws(()=>validateTree({...draft,questions:[{...draft.questions[0],correct:2}]}));});
