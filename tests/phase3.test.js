import test from 'node:test';import assert from 'node:assert/strict';import {CHEMICALS} from '../src/chemistry.js';import {molecularSpec,compareSolutions,challengeDeck,evaluateChallenge} from '../src/phase3-core.js';
test('all twelve substance molecular views work',()=>{for(const c of CHEMICALS){const m=molecularSpec(c.id);assert.equal(m.type,c.type);assert.ok(m.pH>=0&&m.pH<=14);assert.ok(Number.isFinite(m.signal));}});
test('strong vs weak species displays',()=>{const a=molecularSpec('nacl'),b=molecularSpec('acetic');assert.equal(a.parentAmount,0);assert.ok(b.parentAmount>0);assert.ok(b.ions.length>0);});
test('nonelectrolytes have parent molecules and no ions',()=>{for(const id of ['sucrose','urea','ethanol']){const s=molecularSpec(id);assert.equal(s.ions.length,0);assert.ok(s.parentAmount>0);}});
test('dual view equals primary chemistry engine',()=>{const [a,b]=compareSolutions('hcl','acetic');assert.ok(a.signal>b.signal);});
test('six unique mystery chemicals',()=>{const x=challengeDeck(123);assert.equal(x.length,6);assert.equal(new Set(x.map(y=>y.id)).size,6);assert.deepEqual(challengeDeck(123),x);});
test('challenge feedback correct',()=>{const d=challengeDeck(123);const answers=Object.fromEntries(d.map(x=>[x.label,CHEMICALS.find(y=>y.id===x.id).type]));assert.equal(evaluateChallenge(d,answers).filter(x=>x.correct).length,6);});
