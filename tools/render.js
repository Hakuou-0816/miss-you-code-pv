// Render index.html frame-by-frame with headless Chromium and mux with the song via ffmpeg.
// usage: node tools/render.js [audio=audio/song.m4a] [out=out.mp4] [fps=30]
const {chromium}=require('playwright');const {spawn}=require('child_process');const path=require('path');
const AUDIO=process.argv[2]||'audio/song.m4a',OUT=process.argv[3]||'out.mp4',FPS=+(process.argv[4]||30),DUR=130.6;
const N=Math.floor(DUR*FPS);const root=path.resolve(__dirname,'..');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1920,height:1080}});
 p.on('pageerror',e=>console.log('page error:',e.message));
 await p.goto('file://'+path.join(root,'index.html'));await p.evaluate(()=>window.ready);
 const ff=spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-framerate',String(FPS),'-c:v','png','-i','-','-i',AUDIO,
  '-map','0:v','-map','1:a','-c:v','libx264','-preset','slow','-crf','14','-tune','animation','-pix_fmt','yuv420p',
  '-c:a','aac','-b:a','320k','-shortest','-movflags','+faststart',OUT],{stdio:['pipe','inherit','inherit'],cwd:root});
 for(let i=0;i<N;i++){const d=await p.evaluate(t=>{renderAt(t);return document.getElementById('c').toDataURL('image/png')},i/FPS);
  if(!ff.stdin.write(Buffer.from(d.slice(d.indexOf(',')+1),'base64')))await new Promise(r=>ff.stdin.once('drain',r));
  if(i%300===0)console.log(`frame ${i}/${N}`);}
 ff.stdin.end();await new Promise(r=>ff.on('close',r));await b.close();console.log('done ->',OUT);})();
