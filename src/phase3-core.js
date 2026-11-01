import {CHEMICALS,computeSolution} from './chemistry.js';
export const TYPE_LABEL={strong:'อิเล็กโทรไลต์แก่',weak:'อิเล็กโทรไลต์อ่อน',none:'นอนอิเล็กโทรไลต์'};
export function molecularSpec(id,concentration=0.1){
 const s=computeSolution(id,concentration); const ions=Object.entries(s.ionCounts).map(([name,amount])=>({name,amount,charge:name.endsWith('+')?1:-1}));
 const parentAmount=s.chemical.type==='weak'?Math.max(0,concentration*(1-s.fraction)):s.chemical.type==='none'?concentration:0;
 return {id,formula:s.chemical.formula,type:s.chemical.type,pH:s.pH,fraction:s.fraction,ions,parentAmount,signal:s.relativeIndex,brightness:s.brightness};
}
export function compareSolutions(a,b,c=0.1){return [molecularSpec(a,c),molecularSpec(b,c)];}
export function challengeDeck(seed=1,count=6){let n=seed>>>0;const shuffled=[...CHEMICALS].sort((a,b)=>a.id.localeCompare(b.id));for(let i=shuffled.length-1;i>0;i--){n=(Math.imul(1664525,n)+1013904223)>>>0;const j=n%(i+1);[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];}return shuffled.slice(0,count).map((c,i)=>({label:String.fromCharCode(65+i),id:c.id}));}
export function evaluateChallenge(deck,answers){return deck.map(x=>({label:x.label,submitted:answers[x.label]??null,correct:answers[x.label]===CHEMICALS.find(y=>y.id===x.id).type}));}
