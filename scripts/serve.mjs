import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const types={'.jpg':'image/jpeg','.png':'image/png','.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.json':'application/json; charset=utf-8','.md':'text/plain; charset=utf-8','.csv':'text/csv; charset=utf-8','.xml':'application/xml'};
http.createServer((req,res)=>{try{const u=new URL(req.url,'http://localhost');const pathname=decodeURIComponent(u.pathname);const file=path.resolve(root,'.'+pathname+(pathname.endsWith('/')?'index.html':''));const relative=path.relative(root,file);if(relative.startsWith('..')||relative.split(path.sep).some(p=>p.startsWith('.'))){res.writeHead(403);res.end();return;}const bytes=fs.readFileSync(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(bytes);}catch{res.writeHead(404);res.end('Not found');}}).listen(4178,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4178/'));
