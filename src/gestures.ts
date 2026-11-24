/** Count folded fingers using joint angles and distance to the wrist.
 * Thumb is excluded so either hand and different thumb positions work. */
type Point = {x:number;y:number;z:number};
const distance = (a:Point,b:Point) => Math.hypot(a.x-b.x,(a.y-b.y)*.75,a.z-b.z);
function angle(a:Point,b:Point,c:Point):number {
 const u=[a.x-b.x,(a.y-b.y)*.75,a.z-b.z],v=[c.x-b.x,(c.y-b.y)*.75,c.z-b.z];
 const norm=Math.hypot(...u)*Math.hypot(...v);
 return norm>1e-8?Math.acos(Math.max(-1,Math.min(1,u.reduce((s,x,i)=>s+x*v[i],0)/norm)))*180/Math.PI:180;
}
export function countCurled(p:Point[]):number {
 if(p.length!==21)return 0;
 return [5,9,13,17].filter(i=>angle(p[i],p[i+1],p[i+2])<125 || (angle(p[i+1],p[i+2],p[i+3])<135 && distance(p[i+3],p[0])<distance(p[i+1],p[0])*1.15)).length;
}
