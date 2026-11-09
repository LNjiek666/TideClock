export const defaults={work:25,short:5,long:15,interval:4,end:'stop',display:'exact',sound:true,notifications:false,showSeconds:false,hour12:false,homeLayoutVersion:2,colorClock:'#ffffff',colorWork:'#ff6669',colorShort:'#35d49a',colorLong:'#619dff',theme:'light',fireworks:true,hideDone:false};
export function dayKey(now=Date.now()){const d=new Date(now);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
export function freshTimer(settings=defaults,mode='work'){return {mode,duration:settings[mode]*60000,remaining:settings[mode]*60000,running:false,deadline:null,startedAt:null,handled:false,round:0};}
export function remaining(t,now=Date.now()){return t.running?t.deadline-now:t.remaining;}
export function toggleTimer(t,now=Date.now()){if(t.running){t.remaining=remaining(t,now);t.running=false;t.deadline=null;}else{t.startedAt??=now;t.deadline=now+t.remaining;t.running=true;}return t;}
export function nextMode(t,settings){return t.mode==='work'?((t.round+1)%settings.interval===0?'long':'short'):'work';}
export function advance(t,settings){const round=t.round+(t.mode==='work'&&t.handled?1:0);return {...freshTimer(settings,nextMode(t,settings)),round};}
export function takeCompletion(t,tasks,now=Date.now()){if(!t.running||remaining(t,now)>0||t.handled)return null;t.handled=true;return {id:`${t.startedAt}-${t.mode}`,mode:t.mode,duration:t.duration,at:now,completed:tasks.filter(x=>x.done&&x.doneAt>=t.startedAt&&x.doneAt<=now).map(x=>({id:x.id,text:x.text})),round:t.round+1};}
export function formatTime(ms){const secs=Math.ceil(Math.max(0,Math.abs(ms))/1000);return `${ms<0?'+':''}${String(Math.floor(secs/60)).padStart(2,'0')}:${String(secs%60).padStart(2,'0')}`;}
