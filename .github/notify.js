// Sends an "update is live" push to every device in push.json.
const wp=require('web-push'),fs=require('fs');
const cfg=JSON.parse(fs.readFileSync('push.json','utf8'));
const key=process.env.VAPID_PRIVATE;
if(!key||!cfg.publicKey){console.log('No VAPID_PRIVATE secret yet, skipping.');process.exit(0);}
if(!cfg.subs.length){console.log('No devices signed up yet, skipping.');process.exit(0);}
try{const ec=require('crypto').createECDH('prime256v1');ec.setPrivateKey(Buffer.from(key.trim(),'base64url'));const pub=ec.getPublicKey().toString('base64url');console.log('second key set:',process.env.HAS2,'| key matches push.json:',pub===cfg.publicKey,'| key belongs to',pub.slice(0,10));}catch(e){console.log('key check failed',e.message);}
wp.setVapidDetails('https://waugusta1.github.io/my-games/',cfg.publicKey,key.trim());
const line=(process.env.MSG||'').split('\n')[0].trim()||'Something new is ready to play.';
const body=JSON.stringify({title:'My Games updated',body:line,url:'./index.html'});
(async()=>{let ok=0;for(const s of cfg.subs){try{const r=await wp.sendNotification(s,body,{TTL:86400,urgency:'normal'});console.log('sent',r.statusCode);ok++;}catch(e){console.log('failed',e.statusCode||'',e.body||e.message);}}
 if(!ok)process.exit(1);})();
