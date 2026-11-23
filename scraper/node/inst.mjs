import { overpass } from './overpass.mjs';
import fs from 'node:fs';
const bbox = '24.35,90.3,25.2,91.15';
const q = `[out:json][timeout:120];(nwr["amenity"~"^(school|college|university|madrasa)$"](${bbox}););out center tags;`;
const j = await overpass(q, 5);
fs.writeFileSync(process.argv[2], JSON.stringify(j));
console.log('institutions in bbox', j.elements.length);
