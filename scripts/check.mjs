import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8').replace(/^\uFEFF/,'');
const data=JSON.parse(read('evidence/data.json'));
const sum=(a,k)=>a.reduce((s,r)=>s+r[k],0);
assert.equal(data.testRuns.length,data.summary.recordedMajorTestRuns);
assert.equal(sum(data.testRuns,'cases'),data.summary.recordedCaseExecutions);
assert.equal(data.testRuns.at(-1).cases,data.summary.latestTestCases);
assert.equal(sum(data.qaGroups,'starts'),data.summary.qaStarts);
assert.equal(sum(data.qaGroups,'resultsObtained'),data.summary.qaResultsObtained);
assert.equal(sum(data.qaGroups,'resultsMissing'),data.summary.qaResultsMissing);
assert.equal(data.summary.qaStarts,data.summary.qaResultsObtained+data.summary.qaResultsMissing);
assert.equal(data.humanGate.length,data.summary.humanGateResponses);
assert.equal(sum(data.liveCalls,'requestsLowerBound'),data.summary.cloudflareRequestsLowerBound);
const records=data.qaGroups.flatMap(g=>g.records);
assert.equal(records.length,data.summary.qaStarts);
assert.equal(new Set(records.map(r=>r.id)).size,records.length);
assert.equal(new Set(records.map(r=>r.sourceSha256)).size,records.length);
assert.equal(records.filter(r=>r.resultObtained).length,data.summary.qaResultsObtained);
const expected={recordedMajorTestRuns:37,recordedCaseExecutions:2970,latestTestCases:200,qaStarts:43,qaResultsObtained:41,qaResultsMissing:2,humanGateResponses:10,cloudflareRequestsLowerBound:170};
assert.deepEqual(data.summary,expected,'Update expected snapshot only after source reconciliation');
const files=[];
function walk(dir=''){for(const entry of fs.readdirSync(path.join(root,dir),{withFileTypes:true})){if(['.git','.preview','node_modules'].includes(entry.name)||(dir==='examples/blind-qa'&&entry.name==='output'))continue;const f=path.posix.join(dir,entry.name);if(entry.isDirectory())walk(f);else files.push(f);}}
walk();
const forbidden=files.filter(f=>/(^|\/)(?:\.env|\.runtime|credentials|secrets|claude-stdout|claude-prompt|session)/i.test(f));
assert.deepEqual(forbidden,[],'Forbidden public file');
const pages=files.filter(f=>f.endsWith('.html'));
let links=0;
for(const p of pages){const html=read(p);assert.match(html,/<html lang="ja">/);assert.match(html,/name="viewport"/);assert.equal((html.match(/<h1[ >]/g)||[]).length,1,`single h1 ${p}`);const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size,`duplicate IDs ${p}`);for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){const url=m[1];if(/^(?:https?:|mailto:|tel:)/.test(url))continue;links++;const [file,hash]=url.split('#');const target=file?path.posix.normalize(path.posix.join(path.posix.dirname(p),decodeURIComponent(file))):p;assert.ok(fs.existsSync(path.join(root,target)),`missing target ${p} -> ${url}`);if(hash&&target.endsWith('.html'))assert.ok(read(target).includes(`id="${hash}"`),`missing anchor ${p} -> ${url}`);}}
const texts=files.filter(f=>/\.(?:md|html|json|csv|svg|css|xml)$/.test(f));
for(const f of texts){const s=read(f);assert.ok(!/(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|sk-[A-Za-z0-9]{24,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)/.test(s),`credential-like material ${f}`);assert.ok(!/[A-Z]:[\\/]Users[\\/]/i.test(s),`local absolute path ${f}`);assert.ok(!/"session_id"\s*:/.test(s),`execution identifier ${f}`);}
for(const name of ['test-runs','qa-groups','human-gate','live-calls']){const csv=read(`evidence/${name}.csv`);assert.ok(!csv.includes('"undefined"'));assert.ok(csv.split(/\r?\n/).length>2);}
const press=read('press.md').replace(/\[([^\]]+)\]\([^)]+\)/g,'$1').replace(/[#*`\r\n]/g,'');
assert.ok(press.length>=1000&&press.length<=1500,`press length ${press.length}`);
console.log(JSON.stringify({status:'PASS',files:files.length,htmlPages:pages.length,localLinks:links,pressCharacters:press.length,summary:data.summary,scope:'Arithmetic, internal targets, required markup, public-file checks; visual/manual review remains separate.'},null,2));
