import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = p => fs.readFileSync(path.join(root,p),'utf8').replace(/^\uFEFF/,'');
const write = (p,s) => fs.writeFileSync(path.join(root,p),s,'utf8');
const data = JSON.parse(read('evidence/data.json'));
const base = 'https://suguruwada0612-ship-it.github.io/dual-ai-qa-report/';
const repo = 'https://github.com/suguruwada0612-ship-it/dual-ai-qa-report';
const esc = s => String(s ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function inline(s){
  return esc(s).replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<figure class="hero-diagram"><img src="$2" alt="$1" width="560" height="920" loading="lazy"><figcaption>開発・独立QA・修正・再監査・人間による確認</figcaption></figure>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2">$1</a>')
    .replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
}
function table(headers,rows,caption){
 return `<div class="table-scroll" role="region" aria-label="${esc(caption)}" tabindex="0"><table><caption>${esc(caption)}</caption><thead><tr>${headers.map(x=>`<th scope="col">${esc(x)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(x=>`<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
function markdown(source,ids=[]){
 const lines=source.trim().split(/\r?\n/), out=[]; let h=0;
 for(let i=0;i<lines.length;){
  const s=lines[i];
  if(!s.trim()){i++;continue;}
  if(s.startsWith('![')){out.push(inline(s));i++;continue;}
  if(s.startsWith('```')){let code=[];i++;while(i<lines.length&&!lines[i].startsWith('```'))code.push(lines[i++]);i++;out.push(`<pre><code>${esc(code.join('\n'))}</code></pre>`);continue;}
  if(/^#{1,4} /.test(s)){const n=s.indexOf(' '),label=s.slice(n+1);const id=n===2?(ids[h++]||`section-${h}`):'';out.push(`<h${n}${id?` id="${id}"`:''}>${inline(label)}</h${n}>`);i++;continue;}
  if(s.startsWith('|')){const cells=s=>s.trim().replace(/^\||\|$/g,'').split('|').map(x=>x.trim());const head=cells(s);let rows=[];i+=2;while(i<lines.length&&lines[i].startsWith('|'))rows.push(cells(lines[i++]).map(inline));out.push(table(head,rows,head[0]+'・集計と説明'));continue;}
  if(/^(?:- |\d+\. )/.test(s)){const ordered=/^\d+\./.test(s),tag=ordered?'ol':'ul';let list=[];while(i<lines.length&&/^(?:- |\d+\. )/.test(lines[i]))list.push(`<li>${inline(lines[i++].replace(/^(?:- |\d+\. )/,''))}</li>`);out.push(`<${tag}>${list.join('')}</${tag}>`);continue;}
  if(s.startsWith('> ')){let q=[];while(i<lines.length&&lines[i].startsWith('> '))q.push(inline(lines[i++].slice(2)));out.push(`<blockquote class="quote"><p>${q.join('<br>')}</p></blockquote>`);continue;}
  let p=[];while(i<lines.length&&lines[i].trim()&&!/^(?:#{1,4} |\||> |```|- |\d+\. )/.test(lines[i]))p.push(lines[i++]);out.push(`<p>${inline(p.join('\n'))}</p>`);
 }
 return out.join('\n');
}
function shell(title,body,file,description){
const active=f=>f===file?' aria-current="page"':'';
return `<!doctype html>
<html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}｜こむぎパソコン教室</title><meta name="description" content="${esc(description)}"><meta name="theme-color" content="#102b46"><link rel="canonical" href="${base}${file==='index.html'?'':file}"><meta property="og:type" content="article"><meta property="og:locale" content="ja_JP"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${base}${file==='index.html'?'':file}"><meta property="og:site_name" content="こむぎパソコン教室"><link rel="icon" href="assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="assets/style.css"></head>
<body><a class="skip-link" href="#main">本文へ移動</a><header class="site-header"><div class="container"><a class="brand" href="index.html">こむぎパソコン教室<small>技術実証レポート · 岩手県北上市</small></a><nav class="nav" aria-label="メインナビゲーション"><a href="index.html"${active('index.html')}>レポート</a><a href="evidence.html"${active('evidence.html')}>根拠・集計</a><a href="press.html"${active('press.html')}>プレスリリース</a></nav></div></header>
<main id="main" class="container">${body}</main>
<footer class="site-footer"><div class="container"><div><p><strong>こむぎパソコン教室</strong></p><p>岩手県北上市 · 集計基準日 2026年11月22日（JST）</p><p>コードの検証と、実際のAI応答品質の評価を分けて公開しています。</p></div><nav aria-label="フッターナビゲーション"><a href="${repo}">GitHub</a><a href="UPDATE.md">更新手順</a><a href="https://komugi-pc-school.tank.jp/">公式サイト・お問い合わせ</a></nav></div></footer></body></html>\n`;
}
const reportIDs=['overview','roles','process','cases','metrics','findings','publication'];
const reportHTML=markdown(read('report.md').replace(/^# .*\r?\n/,''),reportIDs);
const metric=(value,unit,label)=>`<div class="metric"><span class="metric-value">${value}<small>${unit}</small></span><span class="metric-label">${label}</span></div>`;
const hero=`<section class="hero"><p class="eyebrow">KOMUGI / DEVELOPMENT &amp; INDEPENDENT QA</p><h1>AIでつくる。<br>別のAIで確かめる。<br>人が判断する。</h1><p class="lede">Dual-AI QA 技術実証レポート</p><p>岩手・北上の個人パソコン教室が実践した、<br>CodexとClaude Codeによる開発・独立QAの記録。</p><div class="meta"><span>発信：こむぎパソコン教室</span><span>2026年11月22日 公開</span></div><div class="actions"><a class="button" href="#overview">取り組みを読む</a><a class="button secondary" href="press.html">報道関係者の方へ</a></div><div class="metrics">${metric('2,970','件','主要自動テストの延べケース実行<br>37回分の記録・繰り返しを含む')}${metric('200','ケース','最新の全体テスト数<br>固定受入5ケースを含む')}${metric('43','回以上','独立QAの起動記録<br>結果取得41回・未取得2回')}${metric('10','対応','Human Gate起点の修正<br>受入合格数とは異なる')}</div><p class="note">資料照合で過去の独立QA3回を追加確認。既存集計40回からの<a href="evidence.html#correction">補正理由を公開</a>しています。</p></section>`;
const toc=`<nav class="toc" aria-label="レポートの目次"><h2>このレポートで分かること</h2><ol>${['取り組みの背景','3者の役割分担','検証の流れ','問題発見と修正の事例','集計と数え方','成果と残る課題','公開資料・発信者'].map((s,i)=>`<li><a href="#${reportIDs[i]}">${s}</a></li>`).join('')}</ol></nav>`;
write('index.html',shell('Dual-AI QA 技術実証レポート',hero+toc+`<article class="article prose">${reportHTML}</article>`,'index.html','Codexで開発しClaude Codeで独立QA、人間が授業への採否を判断。岩手・北上のこむぎパソコン教室による実証記録と集計根拠。'));
write('press.html',shell('岩手・北上の個人パソコン教室、異種AIを組み合わせた開発・独立QAの実証記録を公開',`<article class="article prose"><p class="eyebrow">PRESS RELEASE</p>${markdown(read('press.md'))}<div class="actions"><a class="button" href="index.html">技術実証レポートを読む</a><a class="button secondary" href="press.md" download>Markdown原稿を保存</a></div><p class="note">集計方法と補正理由は<a href="evidence.html">公開根拠資料</a>をご覧ください。</p></article>`,'press.html','こむぎパソコン教室が異種AIによる開発・独立QAの実証記録を公開。2026年11月22日発表。報道用原稿と集計根拠を掲載。'));
const ref=s=>s?`${esc(s.file)}${s.line?`:${s.line}`:''}${s.lines?`:${s.lines}`:''}`:'';
const csv=(name,headers,rows)=>write(`evidence/${name}.csv`,'\uFEFF'+[headers,...rows].map(r=>r.map(v=>'"'+String(v??'').replaceAll('"','""')+'"').join(',')).join('\r\n')+'\r\n');
const testRows=data.testRuns.map(r=>[r.id,r.date,r.phase,r.cases,ref(r.source)]);
const qaRows=data.qaGroups.map((r,i)=>['Q'+String(i+1).padStart(2,'0'),r.phase,r.starts,r.resultsObtained,r.resultsMissing,ref(r.source)]);
const gateRows=data.humanGate.map(r=>[r.id,r.phase,[r.change,r.status].filter(Boolean).join('。'),ref(r.source)]);
const liveRows=data.liveCalls.map(r=>[r.id,r.phase,r.minimumRequests??r.requestsLowerBound??r.lowerBound,r.basis??r.note,ref(r.source)]);
const testH=['ID','日付','工程','延べケース','出典'];
const qaH=['ID','監査対象','起動','結果取得','未取得','出典'];
const gateH=['ID','対応','確認範囲','出典'];
const liveH=['ID','試験群','呼び出し下限','数え方','出典'];
for(const [name,headers,rows] of [['test-runs',testH,testRows],['qa-groups',qaH,qaRows],['human-gate',gateH,gateRows],['live-calls',liveH,liveRows]])csv(name,headers,rows);
const ledgers=`<div class="ledger-block">${table(testH,testRows.map(r=>r.map(esc)),'主要自動テスト：37記録・延べ2,970件')}${table(qaH,qaRows.map(r=>r.map(esc)),'独立QA：18群・43起動・41取得・2未取得')}${table(gateH,gateRows.map(r=>r.map(esc)),'Human Gate：10対応')}${table(liveH,liveRows.map(r=>r.map(esc)),'実Cloudflare通信：7群・下限170回')}<p>CSV：<a href="evidence/test-runs.csv" download>主要テスト</a> ／ <a href="evidence/qa-groups.csv" download>独立QA</a> ／ <a href="evidence/human-gate.csv" download>Human Gate</a> ／ <a href="evidence/live-calls.csv" download>実AI通信</a></p></div>`;
let ev=markdown(read('evidence.md'),['scope','correction','ledgers','cases','limits','sources']);
ev=ev.replace('<h2 id="cases">',ledgers+'<h2 id="cases">');
const correction=markdown(read('evidence/audit-count-correction.md').replace(/^# .*\r?\n/,'').replaceAll('(data.json)','(evidence/data.json)'));
ev=ev.replace('<h2 id="ledgers">',`<details><summary>補正の詳細・監査抜粋・原本ハッシュを読む</summary>${correction}</details><h2 id="ledgers">`);
write('evidence.html',shell('公開根拠資料・集計方法',`<article class="article"><div class="prose"><p class="eyebrow">EVIDENCE &amp; METHODOLOGY</p>${ev}</div></article>`,'evidence.html','主要テスト37記録、独立QA43起動の台帳と補正根拠、監査抜粋、出典・集計方法を公開。'));
write('404.html',shell('ページが見つかりません',`<section class="article prose"><h1>ページが見つかりません</h1><p><a href="${base}">技術実証レポートのトップへ戻る</a></p></section>`,'404.html','こむぎパソコン教室の技術実証レポート'));
write('sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['','press.html','evidence.html'].map(p=>`<url><loc>${base}${p}</loc><lastmod>${data.asOf}</lastmod></url>`).join('')}</urlset>\n`);
console.log(JSON.stringify({built:['index.html','press.html','evidence.html','404.html'],csv:4,pressCharacters:read('press.md').replace(/\[([^\]]+)\]\([^)]+\)/g,'$1').replace(/[#*`\r\n]/g,'').length}));
