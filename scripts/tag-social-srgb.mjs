import fs from 'node:fs';
const profile=fs.readFileSync(process.env.WINDIR+'/System32/spool/drivers/color/sRGB Color Space Profile.icm');
const p='assets/media/dual-ai-qa-dx-square.jpg',jpg=fs.readFileSync(p),payload=Buffer.concat([Buffer.from('ICC_PROFILE\0','ascii'),Buffer.from([1,1]),profile]),head=Buffer.alloc(4);head.writeUInt16BE(0xffe2);head.writeUInt16BE(payload.length+2,2);fs.writeFileSync(p,Buffer.concat([jpg.subarray(0,2),head,payload,jpg.subarray(2)]));
function crc(b){let c=0xffffffff;for(const v of b){c^=v;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0);}return (c^0xffffffff)>>>0;}
for(const p of ['assets/media/dual-ai-qa-dx-square.png','assets/ogp-dual-ai-qa-dx.png']){const b=fs.readFileSync(p),ch=Buffer.alloc(13);ch.writeUInt32BE(1);ch.write('sRGB',4);ch[8]=0;ch.writeUInt32BE(crc(ch.subarray(4,9)),9);fs.writeFileSync(p,Buffer.concat([b.subarray(0,33),ch,b.subarray(33)]));}
