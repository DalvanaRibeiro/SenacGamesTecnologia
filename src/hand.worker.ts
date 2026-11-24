import {FilesetResolver,HandLandmarker} from '@mediapipe/tasks-vision';
let pose:HandLandmarker|undefined;
self.onmessage=async(e:MessageEvent)=>{
 const m=e.data;
 try{
 if(m.type==='init'){
 const files=await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm');
 const options={baseOptions:{modelAssetPath:'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task'},runningMode:'VIDEO' as const,numHands:1,minHandDetectionConfidence:.5,minHandPresenceConfidence:.5,minTrackingConfidence:.45};
 // CPU in worker avoids browser-specific worker WebGL limitations.
 try{pose=await HandLandmarker.createFromOptions(files,{...options,baseOptions:{...options.baseOptions,delegate:"GPU"}});}catch{pose=await HandLandmarker.createFromOptions(files,options);}self.postMessage({type:'ready'});
 }else if(m.type==='frame'){
 const bitmap:ImageBitmap=m.bitmap;try{const start=performance.now();const p=pose!.detectForVideo(bitmap,m.timestamp).landmarks[0];self.postMessage({type:'result',points:p??null,ms:performance.now()-start,timestamp:m.timestamp});}finally{bitmap.close();}
 }
 }catch(err){self.postMessage({type:'error',message:String(err)});}
};
