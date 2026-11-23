const pages = ['Netrokona_Sadar_Upazila','Durgapur_Upazila,_Netrokona','Kalmakanda_Upazila','Purbadhala_Upazila','Kendua_Upazila','Barhatta_Upazila','Atpara_Upazila','Madan_Upazila','Mohanganj_Upazila','Khaliajuri_Upazila','Netrokona_District'];
for (const p of pages) {
  const r = await fetch('https://en.wikipedia.org/w/api.php?action=parse&prop=wikitext&format=json&redirects=1&page=' + encodeURIComponent(p), { headers: { 'User-Agent': 'NetrokonaPortalBot/1.0' } });
  const j = await r.json(); const w = j.parse?.wikitext?.['*'] ?? '';
  const m = w.match(/==\s*Education\s*==([\s\S]*?)(\n==[^=]|$)/);
  console.log('=====', p, w.length); console.log(m ? m[1].trim().slice(0, 900) : '(no education section)');
}
