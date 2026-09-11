import fs from 'node:fs/promises';
const base = 'https://novellajewell.com';
const decode = s => (s??'').replace(/&amp;/g,'&').replace(/&#x27;|&#39;/g,"'").replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
const attrs = s => Object.fromEntries([...s.matchAll(/([\w:-]+)\s*=\s*["']([^"']*)["']/g)].map(m=>[m[1],decode(m[2])]));
const clean = s => decode(s.replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim();
async function request(url) {
 const start=Date.now();
 const res=await fetch(url,{signal:AbortSignal.timeout(30000)});
 const html=await res.text();
 return {url,finalUrl:res.url,status:res.status,ms:Date.now()-start,headers:Object.fromEntries(res.headers),html};
}
const sitemap=await request(base+'/sitemap.xml');
const sitemapUrls=[...sitemap.html.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>decode(m[1]));
const guide=await request(base+'/rehber');
const guideUrls=[...guide.html.matchAll(/href="(\/rehber\/[^"?#]+)"/g)].map(m=>base+decode(m[1]));
const extras=['/rehber','/mesafeli-satis-sozlesmesi','/on-bilgilendirme','/sepet','/odeme','/odeme/sonuc','/siparis-takip','/iade/talep','/novella-audit-404-20260901'];
const urls=[...new Set([...sitemapUrls,...guideUrls,...extras.map(p=>base+p)])];
let cursor=0; const pages=[];
async function worker(){while(cursor<urls.length){const url=urls[cursor++];try{
 const r=await request(url);
 const meta=[...r.html.matchAll(/<meta\b[^>]*>/g)].map(m=>attrs(m[0]));
 const canonical=[...r.html.matchAll(/<link\b[^>]*>/g)].map(m=>attrs(m[0])).find(x=>x.rel==='canonical')?.href;
 const images=[...r.html.matchAll(/<img\b[^>]*>/g)].map(m=>attrs(m[0])).map(i=>Object.fromEntries(Object.entries(i).filter(([k])=>['src','alt','sizes','loading','width','height'].includes(k))));
 const jsonld=[...r.html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m=>{try{return JSON.parse(m[1])}catch{return {parseError:true}}});
 const links=[...new Set([...r.html.matchAll(/<a\b[^>]*>/g)].map(m=>attrs(m[0]).href).filter(Boolean))];
 pages.push({url,finalUrl:r.finalUrl,status:r.status,ms:r.ms,htmlBytes:Buffer.byteLength(r.html),cache:r.headers['x-vercel-cache'],title:clean(r.html.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1]??''),h1:[...r.html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map(m=>clean(m[1])),description:meta.find(m=>m.name==='description')?.content,canonical,meta,jsonld,images,links,placeholders:/\[DOLDURULACAK/.test(r.html)});
}catch(e){pages.push({url,error:String(e)})}}}
await Promise.all(Array.from({length:4},worker));
for(let depth=0;depth<3;depth++){
 const known=new Set(urls.map(u=>new URL(u).pathname));
 const more=[...new Set(pages.flatMap(p=>p.links??[]).filter(u=>u.startsWith('/')&&!u.startsWith('//')).map(u=>u.split(/[?#]/)[0]).filter(u=>u&&!known.has(u)&&!/^\/(api|admin)(\/|$)/.test(u)))];
 if(!more.length)break;
 urls.push(...more.map(p=>base+p));
 await Promise.all(Array.from({length:4},worker));
}
const robots=await request(base+'/robots.txt');
const redirects=[];for(const url of ['http://novellajewell.com','https://www.novellajewell.com',base+'/hakkimizda']){const r=await fetch(url,{redirect:'manual',signal:AbortSignal.timeout(15000)});redirects.push({url,status:r.status,location:r.headers.get('location')})}
const data={date:new Date().toISOString(),sitemap:{status:sitemap.status,urls:sitemapUrls},robots:{status:robots.status,text:robots.html},redirects,pages:pages.sort((a,b)=>a.url.localeCompare(b.url))};
await fs.writeFile('docs/audits/2026-09-01-http.json',JSON.stringify(data,null,2));
const duplicates=key=>{const m={}; for(const p of pages){if(!p[key])continue; (m[p[key]]??=[]).push(p.url)}return Object.entries(m).filter(([,v])=>v.length>1)};
console.log(JSON.stringify({count:pages.length,sitemapCount:sitemapUrls.length,productCount:pages.filter(p=>p.url.includes('/urun/')).length,non200:pages.filter(p=>p.status!==200).map(p=>({url:p.url,status:p.status,error:p.error})),badH1:pages.filter(p=>p.status===200&&p.h1?.length!==1).map(p=>({url:p.url,h1:p.h1})),noDescription:pages.filter(p=>!p.description).map(p=>p.url),noCanonical:pages.filter(p=>!p.canonical).map(p=>p.url),duplicateTitles:duplicates('title'),duplicateDescriptions:duplicates('description'),guidesMissing:guideUrls.filter(u=>!sitemapUrls.includes(u)),missingAlt:pages.filter(p=>p.images?.some(i=>!('alt' in i))).map(p=>p.url),placeholders:pages.filter(p=>p.placeholders).map(p=>p.url),robots:data.robots,redirects},null,2));
