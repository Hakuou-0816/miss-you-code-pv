// Save still frames for quick checks. usage: node tools/snapshot.js 9.5 60.2 118
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1920,height:1080}});
 await p.goto('file://'+path.resolve(__dirname,'..','index.html'));await p.evaluate(()=>window.ready);
 for(const t of process.argv.slice(2).map(Number)){const d=await p.evaluate(t=>{renderAt(t);return document.getElementById('c').toDataURL('image/png')},t);
  fs.writeFileSync(`frame_${t}.png`,Buffer.from(d.split(',')[1],'base64'));console.log('saved frame_'+t+'.png');}
 await b.close();})();
