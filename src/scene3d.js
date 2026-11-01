/** IONVERSE Phase 2 rendered laboratory; visual-only and never changes the chemistry engine. */
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
export function createScene(container,events={}){
 const scene=new THREE.Scene();scene.background=new THREE.Color('#122133');scene.fog=new THREE.Fog('#122133',13,23);
 const camera=new THREE.PerspectiveCamera(43,1,.1,80);camera.position.set(5.7,4.1,7.5);
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.45;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.75));container.appendChild(renderer.domElement);
 const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,.95,0);controls.enablePan=false;controls.minDistance=5;controls.maxDistance=12;controls.minPolarAngle=.55;controls.maxPolarAngle=1.45;controls.enableDamping=true;controls.dampingFactor=.07;
 scene.add(new THREE.HemisphereLight(0xe8f5ff,0x49617c,2.0));const key=new THREE.DirectionalLight(0xffffff,3.8);key.position.set(-3,8,6);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-8;key.shadow.camera.right=8;key.shadow.camera.top=8;key.shadow.camera.bottom=-8;scene.add(key);const back=new THREE.PointLight(0x74c6fa,22,12);back.position.set(4,4,-3);scene.add(back);
 const mat=(c,metal=.0,rough=.5)=>new THREE.MeshStandardMaterial({color:c,metalness:metal,roughness:rough});
 const steel=mat('#b0c3d0',.83,.22), dark=mat('#1e344a',.65,.28), pale=mat('#e4e9ee',.1,.32), navy=mat('#14283f',.2,.44), gold=mat('#d5b266',.55,.25);
 const glass=new THREE.MeshPhysicalMaterial({color:'#d5f2ff',metalness:0,roughness:.045,transmission:.88,thickness:.42,ior:1.45,transparent:true,opacity:.52,side:THREE.DoubleSide,depthWrite:false});
 const fluidMat=new THREE.MeshPhysicalMaterial({color:'#a5e9fe',roughness:.14,transmission:.78,thickness:.8,transparent:true,opacity:.63,depthWrite:false});
 const bulbGlass=new THREE.MeshPhysicalMaterial({color:'#dceaff',transparent:true,opacity:.3,transmission:.85,roughness:.04,depthWrite:false});
 const lightMat=new THREE.MeshStandardMaterial({color:'#ead29e',emissive:'#ffc56e',emissiveIntensity:0,roughness:.28});
 const interactive=[];const register=(mesh,type)=>{mesh.userData.action=type;interactive.push(mesh);return mesh;};
 function mesh(geo,material,x=0,y=0,z=0,parent=scene){const m=new THREE.Mesh(geo,material);m.position.set(x,y,z);parent.add(m);return m;}
 function box(w,h,d,m,x,y,z){const o=mesh(new THREE.BoxGeometry(w,h,d),m,x,y,z);o.receiveShadow=true;o.castShadow=true;return o;}
 function cyl(rt,rb,h,m,x,y,z,open=false){const o=mesh(new THREE.CylinderGeometry(rt,rb,h,48,1,open),m,x,y,z);o.castShadow=true;return o;}
 function label(text,w=1.1,h=.28,bg='#e7edf4',fg='#1a2f43'){const can=document.createElement('canvas');can.width=512;can.height=128;const ctx=can.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,512,128);ctx.fillStyle=fg;ctx.font='bold 65px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,256,67,480);const texture=new THREE.CanvasTexture(can);texture.colorSpace=THREE.SRGBColorSpace;const m=new THREE.MeshBasicMaterial({map:texture,transparent:true,side:THREE.DoubleSide});return new THREE.Mesh(new THREE.PlaneGeometry(w,h),m);}
 // workbench, rear slats, floor
 box(13,.32,5.4,mat('#d7e1e9',.18,.28),0,.08,0);box(13,.13,.22,steel,0,-.11,2.65);box(13,.12,.22,steel,0,-.11,-2.65);box(13,2.7,.18,navy,0,1.6,-2.75);for(let i=0;i<11;i++)box(.028,2.1,.04,mat('#294158'),-5+i,.95,-2.63);
 // focus pad and calibration card
 box(2.8,.03,2.25,mat('#b4ccd9',.22,.43),0,.27,.1);
 // beaker center, custom open cylinder; transparent ring rim
 const beaker=new THREE.Group();beaker.position.set(0,.27,.2);scene.add(beaker);
 let beakerWall=new THREE.Mesh(new THREE.CylinderGeometry(.78,.67,1.42,64,1,true),glass);beakerWall.position.y=.79;beaker.add(beakerWall);register(beakerWall,'prepare');
 const bottom=mesh(new THREE.CylinderGeometry(.67,.67,.045,64),glass,0,.1,0,beaker);register(bottom,'prepare');
 const rim=mesh(new THREE.TorusGeometry(.78,.034,10,64),steel,0,1.5,0,beaker);rim.rotation.x=Math.PI/2;register(rim,'prepare');
 const fluid=new THREE.Group();beaker.add(fluid);const water=mesh(new THREE.CylinderGeometry(.70,.64,.65,48),fluidMat,0,.43,0,fluid);const surface=mesh(new THREE.CylinderGeometry(.70,.70,.018,48),new THREE.MeshPhysicalMaterial({color:'#b6edff',roughness:.12,transparent:true,opacity:.44}),0,.76,0,fluid);fluid.scale.y=.03;
 for(let i=1;i<=4;i++){const mark=mesh(new THREE.BoxGeometry(.16,.012,.012),steel,.705,.35+i*.23,0,beaker);mark.rotation.y=.1;}
 // electrodes on lift mechanism
 const electrodeGroup=new THREE.Group();scene.add(electrodeGroup);electrodeGroup.position.set(0,.95,0);
 const poles=[];for(let i of [-1,1]){const p=cyl(.058,.058,1.40,dark,i*.29,1.16,.15);electrodeGroup.add(p);p.position.set(i*.29,1.16,.15);register(p,'submerge');poles.push(p);const cap=mesh(new THREE.CylinderGeometry(.11,.11,.19,24),gold,i*.29,1.93,.15,electrodeGroup);register(cap,'submerge');}
 const bridge=mesh(new THREE.BoxGeometry(.9,.09,.25),steel,0,2,.15,electrodeGroup);register(bridge,'submerge');
 // lamp and battery right
 const stand=box(.65,.14,.62,dark,2.52,.34,-.04);register(stand,'power');
 const stalk=cyl(.085,.09,.55,steel,2.52,.68,-.04);register(stalk,'power');
 const bulb=mesh(new THREE.SphereGeometry(.37,32,24),bulbGlass,2.52,1.16,-.04);bulb.scale.y=1.18;register(bulb,'power');
 const filament=mesh(new THREE.SphereGeometry(.18,24,18),lightMat,2.52,1.14,-.04);register(filament,'power');
 const bulbLight=new THREE.PointLight(0xffb74a,0,4,2);bulbLight.position.set(2.52,1.12,-.04);scene.add(bulbLight);
 const battery=box(.9,.55,.82,navy,3.7,.58,.6);register(battery,'power');const batteryTop=box(.77,.085,.69,steel,3.7,.9,.6);register(batteryTop,'power');const powerLabel=label('DC 6V',.75,.23);powerLabel.position.set(3.7,.63,1.02);scene.add(powerLabel);const powerKnob=mesh(new THREE.CylinderGeometry(.12,.12,.15,22),gold,3.5,.98,.6);register(powerKnob,'power');
 // cables curved
 const cableMat=new THREE.MeshStandardMaterial({color:'#e17f53',roughness:.45});for(const pts of [[new THREE.Vector3(-.29,2.8,.15),new THREE.Vector3(1.6,2.5,-.6),new THREE.Vector3(2.5,.5,-.4)],[new THREE.Vector3(.29,2.8,.15),new THREE.Vector3(1.8,2.8,-.9),new THREE.Vector3(3.8,.9,.6)]]){const curve=new THREE.CatmullRomCurve3(pts);mesh(new THREE.TubeGeometry(curve,30,.027,8,false),cableMat);}
 // labeled sample bottle and pipette
 const bottleGrp=new THREE.Group();bottleGrp.position.set(-2.35,.25,.3);scene.add(bottleGrp);
 const bottle=cyl(.43,.43,1.1,glass,0,.63,0);bottleGrp.add(bottle);bottle.position.set(0,.63,0);register(bottle,'prepare');
 const neck=cyl(.19,.21,.35,glass,0,1.33,0);bottleGrp.add(neck);neck.position.set(0,1.33,0);register(neck,'prepare');
 const lid=cyl(.22,.22,.23,dark,0,1.58,0);bottleGrp.add(lid);lid.position.set(0,1.58,0);register(lid,'prepare');
 let bottleFluid=cyl(.36,.36,.54,new THREE.MeshPhysicalMaterial({color:'#8fd7ee',transparent:true,opacity:.42}),0,.49,0);bottleGrp.add(bottleFluid);bottleFluid.position.set(0,.49,0);
 let bottleLabel=label('HCl',.86,.32);bottleLabel.position.set(0,.84,.441);bottleGrp.add(bottleLabel);bottleLabel.rotation.y=0;
 const pipette=mesh(new THREE.CylinderGeometry(.055,.018,1.4,18),steel,-1.18,1.38,.2);pipette.rotation.z=.25;register(pipette,'prepare');
 // rinse station and circuit connection physical props
 const rinseBase=box(.9,.08,.82,steel,-4.05,.36,-.35);register(rinseBase,'rinse');
 const rinseBottle=cyl(.19,.20,.65,glass,-4.05,.73,-.35);register(rinseBottle,'rinse');
 const rinseCap=cyl(.14,.15,.15,dark,-4.05,1.12,-.35);register(rinseCap,'rinse');
 const rinseName=label('RINSE',.83,.20);rinseName.position.set(-4.05,.48,.1);scene.add(rinseName);
 const connectButton=box(.43,.16,.43,gold,3.85,1.02,.6);register(connectButton,'connect');
 // three litmus strips with planar test tip
 const paperRed=box(.15,.012,.83,mat('#d5536d'),-3.35,.32,1.75);paperRed.rotation.y=.22;register(paperRed,'litmusRed');
 const paperBlue=box(.15,.012,.83,mat('#538ad9'),-3.12,.32,1.75);paperBlue.rotation.y=.22;register(paperBlue,'litmusBlue');
 // coordinate reference and readout placard
 const text=label('CONDUCTIVITY TEST',2.25,.22,'#dae6ed','#243a4a');text.position.set(.0,.33,-1.25);text.rotation.x=-Math.PI/2;scene.add(text);
 const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();let down=null,alreadyDragged=false;
 renderer.domElement.addEventListener('pointerdown',e=>{down=[e.clientX,e.clientY];alreadyDragged=false;});
 renderer.domElement.addEventListener('pointermove',e=>{if(down&&Math.hypot(e.clientX-down[0],e.clientY-down[1])>7)alreadyDragged=true;});
 renderer.domElement.addEventListener('pointerup',e=>{if(!down||alreadyDragged){down=null;return;}down=null;const rect=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(pointer,camera);const hits=raycaster.intersectObjects(interactive,false);const action=hits[0]?.object?.userData?.action;if(action==='prepare')events.onPrepare?.();if(action==='rinse')events.onRinse?.();if(action==='connect')events.onConnect?.();if(action==='submerge')events.onSubmerge?.();if(action==='power')events.onPower?.();if(action==='litmusRed')events.onLitmusRed?.();if(action==='litmusBlue')events.onLitmusBlue?.();});
 let status={prepared:false,submerged:false,brightness:0,litmus:{red:null,blue:null},signal:0};let targetY=0.95,level=.03,glow=0,frame=0;
 function update({state,solution,instrument,prepared,splashUntil}){
  status={prepared,submerged:state.electrodesSubmerged,brightness:instrument.isReady?instrument.level/100:0,litmus:state.litmus,signal:instrument.level};
  targetY=state.electrodesSubmerged?0.15:.95;
  const old=bottleLabel;bottleGrp.remove(old);old.geometry.dispose();old.material.map.dispose();old.material.dispose();bottleLabel=label(solution.chemical.formula,1.06,.34);bottleLabel.position.set(0,.84,.442);bottleGrp.add(bottleLabel);
  const isAcid=solution.pH<4.5,isBase=solution.pH>8.3;
  paperRed.material.color.set(state.litmus.red==='blue'?'#538ad9':'#d5536d');paperBlue.material.color.set(state.litmus.blue==='red'?'#d5536d':'#538ad9');
  fluidMat.color.set('#a5e9fe');bottleFluid.material.color.set('#8fd7ee');
 }
 function resize(){const w=container.clientWidth,h=container.clientHeight;if(w&&h){renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}}
 const obs=new ResizeObserver(resize);obs.observe(container);resize();
 const clock=new THREE.Clock();let stopped=false;
 function animate(){if(stopped)return;requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.05);frame+=dt;
  const factor=1-Math.exp(-dt*5);electrodeGroup.position.y+=(targetY-electrodeGroup.position.y)*factor;
  const fluidTarget=status.prepared?1:.02;level+=(fluidTarget-level)*(1-Math.exp(-dt*2.5));fluid.scale.y=level;
  surface.position.y=.76+Math.sin(frame*3)*.004;
  glow+=(status.brightness-glow)*(1-Math.exp(-dt*4));lightMat.emissiveIntensity=glow*5;bulbLight.intensity=glow*12;
  controls.update();renderer.render(scene,camera);
 }animate();
 function resetCamera(){camera.position.set(5.7,4.1,7.5);controls.target.set(0,.95,0);controls.update();}
 return {update,resetCamera,destroy(){stopped=true;obs.disconnect();controls.dispose();renderer.dispose();container.replaceChildren();}};
}
