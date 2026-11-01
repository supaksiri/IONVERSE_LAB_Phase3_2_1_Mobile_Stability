import {computeSolution,getChemical} from './chemistry.js';
const validTypes=new Set(['strong','weak','none','control']);
export function newLab(){return {id:'hcl',concentration:0.1,prepared:false,volumeMl:0,litmus:{red:null,blue:null},circuitConnected:false,electrodesSubmerged:false,powerOn:false,electrodesClean:true,autoPrep:true,observations:{},history:[],warning:''};}
export function reducer(state, action){
 const s={...state,litmus:{...state.litmus},observations:{...state.observations},history:[...state.history],warning:''};
 switch(action.type){
 case 'SELECT': getChemical(action.id);s.id=action.id;s.prepared=false;s.volumeMl=0;s.litmus={red:null,blue:null};s.electrodesSubmerged=false;s.powerOn=false;s.prepared=true;s.volumeMl=4;s.electrodesClean=true;s.warning='เตรียมตัวอย่างใหม่ 4 mL และล้างขั้วให้อัตโนมัติแล้ว';break;
 case 'CONCENTRATION': {const c=Number(action.value);computeSolution(s.id,c);s.concentration=c;s.prepared=false;s.volumeMl=0;s.litmus={red:null,blue:null};s.electrodesSubmerged=false;s.powerOn=false;s.prepared=true;s.volumeMl=4;s.electrodesClean=true;break;}
 case 'PREPARE':s.prepared=true;s.volumeMl=4;s.electrodesClean=true;s.litmus={red:null,blue:null};s.electrodesSubmerged=false;s.powerOn=false;break;
 case 'LITMUS': {if(!s.prepared){s.warning='เตรียมตัวอย่าง 4 mL ก่อน';break;}if(!['red','blue'].includes(action.color))throw new Error('Invalid litmus color');s.litmus[action.color]=computeSolution(s.id,s.concentration).litmus[action.color];break;}
 case 'CONNECT':s.circuitConnected=!s.circuitConnected;if(!s.circuitConnected)s.powerOn=false;break;
 case 'SUBMERGE':if(!s.prepared){s.warning='ต้องเตรียมสารก่อนจุ่มขั้ว';break;}s.electrodesSubmerged=!s.electrodesSubmerged;break;
 case 'POWER':if(!s.circuitConnected){s.warning='ยังไม่ได้ต่อวงจร กด ① ต่อวงจร ก่อน';break;}s.powerOn=!s.powerOn;break;
 case 'RINSE':s.electrodesClean=true;s.electrodesSubmerged=false;s.powerOn=false;break;
 case 'RECORD':{
 if(!validTypes.has(action.classification)){s.warning='กรุณาเลือกประเภทสารก่อนบันทึก';break;}
 if(!s.prepared||s.litmus.red===null||s.litmus.blue===null||!s.circuitConnected||!s.electrodesSubmerged||!s.powerOn||!s.electrodesClean){s.warning='เตรียมสาร ทดสอบลิตมัสทั้งสองสี ล้างขั้วและเปิดเครื่องวัดก่อนบันทึก';break;}
 const r=computeSolution(s.id,s.concentration);const id=(globalThis.crypto?.randomUUID?.()||`run-${Date.now()}-${s.history.length}`);
 const value={runId:id,id:s.id,concentration:s.concentration,volumeMl:s.volumeMl,red:s.litmus.red,blue:s.litmus.blue,relativeIndex:r.relativeIndex,brightness:r.brightness,classification:action.classification,at:new Date().toISOString()};
 s.observations[id]=value;s.history.push(value);s.electrodesClean=false;s.warning='บันทึกผลแล้ว • เมื่อเลือกสารใหม่ ระบบจะล้างขั้วและเตรียมสารให้อัตโนมัติ';break;
 }
 case 'RESET':return newLab();
 default:throw new Error('Unknown action '+action.type);
 }
 return s;
}
export function circuitChecklist(state){return [{key:'prepared',label:'มีสารตัวอย่าง 4 mL',ok:!!state.prepared},{key:'connected',label:'ต่อวงจร',ok:!!state.circuitConnected},{key:'submerged',label:'จุ่มขั้วทั้งสอง',ok:!!state.electrodesSubmerged},{key:'power',label:'เปิดสวิตช์',ok:!!state.powerOn},{key:'clean',label:'ขั้วไฟฟ้าสะอาด',ok:!!state.electrodesClean}];}
export function instrument(state){const missing=circuitChecklist(state).filter(x=>!x.ok);const isReady=missing.length===0;const solution=computeSolution(state.id,state.concentration);return {isReady,missing,level:isReady?solution.relativeIndex:0,brightness:isReady?solution.brightness:'off',message:!state.prepared?'ยังไม่ได้เตรียมสาร':!state.circuitConnected?'ยังไม่ต่อวงจร':!state.electrodesSubmerged?'ยังไม่จุ่มขั้ว':!state.powerOn?'สวิตช์ปิด':!state.electrodesClean?'ขั้วยังไม่สะอาด':'กำลังวัดค่า (เชิงสัมพัทธ์)'};}
