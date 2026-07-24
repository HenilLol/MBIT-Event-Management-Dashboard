const events = [
 {id:1,title:'AI & Machine Learning Workshop',category:'Workshop',date:'2026-07-28',time:'10:00 AM – 1:00 PM',venue:'Innovation Lab, Block B',organizer:'IEEE MBIT',count:83,description:'Build a practical understanding of machine learning workflows, from data preparation to model evaluation. Bring a laptop and leave with a small working project.',addedAt:'2026-06-01'},
 {id:2,title:'Campus Hackathon 2026',category:'Hackathon',date:'2026-07-30',time:'9:00 AM – 9:00 PM',venue:'Central Auditorium',organizer:'CSI Student Chapter',count:147,description:'A one-day build sprint for teams with big ideas. Choose a campus or community problem, prototype a solution, and present it to a panel of mentors.',addedAt:'2026-06-03'},
 {id:3,title:'Inter-College Basketball Tournament',category:'Sports',date:'2026-08-02',time:'4:00 PM – 7:00 PM',venue:'MBIT Sports Ground',organizer:'Sports Committee',count:62,description:'Cheer for MBIT as teams from across the region compete in an evening of fast-paced basketball. Open to all students and staff.',addedAt:'2026-06-05'},
 {id:4,title:'Designing for the Web',category:'Technical',date:'2026-08-05',time:'11:00 AM – 12:30 PM',venue:'Seminar Hall 2',organizer:'Web Club MBIT',count:54,description:'Learn how thoughtful design systems make digital products clearer, more accessible, and easier to build. A hands-on session for new designers and developers.',addedAt:'2026-06-08'},
 {id:5,title:'Cultural Night: Rang',category:'Cultural',date:'2026-08-09',time:'6:30 PM – 9:30 PM',venue:'Open Air Theatre',organizer:'Cultural Council',count:208,description:'An evening celebrating music, dance, and performances from across the MBIT community. Join us for student-led performances and campus celebration.',addedAt:'2026-06-10'},
 {id:6,title:'Startup Stories & Strategy',category:'Seminar',date:'2026-08-12',time:'2:00 PM – 3:30 PM',venue:'Conference Room A',organizer:'E-Cell MBIT',count:39,description:'Founders and mentors share practical lessons on validating ideas, finding early customers, and building a team that can grow.',addedAt:'2026-06-12'},
 {id:7,title:'CodeSprint Challenge',category:'Competition',date:'2026-08-16',time:'10:00 AM – 2:00 PM',venue:'Computer Lab 4',organizer:'Programming Club',count:71,description:'Test your problem-solving skills in a timed coding challenge with rounds for every experience level.',addedAt:'2026-06-15'},
 {id:8,title:'Resume Workshop',category:'Workshop',date:'2026-08-03',time:'11:00 AM - 2:00 PM',venue:'MBIT Auditorium, A202',organizer:'Campus Career Center Advisors',count:304,description:'Helps you to make your resume and Linkedin profile stronger and professional. A great session to improve your resume and learn something new!',addedAt:'2026-06-18'}
];
const categories=['All Events','Technical','Hackathon','Workshop','Cultural','Sports','Seminar','Competition'];
let selectedCategory='All Events', query='', sortMode='default', interests=new Set(JSON.parse(localStorage.getItem('campus-interests')||'[]')), reminders=new Set(JSON.parse(localStorage.getItem('campus-reminders')||'[]')), recentlyViewed=JSON.parse(localStorage.getItem('campus-recent')||'[]'), calendarDate=new Date(2026,6,1), selectedDay=null;
const $=s=>document.querySelector(s), grid=$('#events-grid'), dialog=$('#event-dialog');
function fmtDate(date){return new Intl.DateTimeFormat('en-IN',{day:'numeric',month:'short',year:'numeric'}).format(new Date(date+'T12:00:00'))}
function dayParts(date){const d=new Date(date+'T12:00:00');return {day:d.getDate(),month:new Intl.DateTimeFormat('en-IN',{month:'short'}).format(d)}}
function padNum(n){return String(n).padStart(2,'0')}
function isSameDay(a,b){return a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate()}
// Parses a "10:00 AM – 1:00 PM" style range into real Date objects for the event's date.
function eventStartEnd(e){
  const [startStr,endStr]=e.time.split(/\s*[-–—]\s*/);
  const to24=t=>{const m=t.trim().match(/(\d+):(\d+)\s*([AP]M)/i);let h=parseInt(m[1],10);const min=parseInt(m[2],10),ap=m[3].toUpperCase();if(ap==='PM'&&h!==12)h+=12;if(ap==='AM'&&h===12)h=0;return {h,min}};
  const s=to24(startStr), en=to24(endStr||startStr);
  const start=new Date(e.date+'T00:00:00');start.setHours(s.h,s.min,0,0);
  const end=new Date(e.date+'T00:00:00');end.setHours(en.h,en.min,0,0);
  if(end<=start)end.setDate(end.getDate()+1);
  return {start,end};
}
function eventStatus(e){
  const {start,end}=eventStartEnd(e), now=new Date();
  if(now>end)return 'Completed';
  if(start-now<=3600000&&start-now>=0)return 'Starting Soon';
  if(isSameDay(now,start))return 'Happening Today';
  return 'Upcoming';
}
function countdown(e){
  const {start}=eventStartEnd(e), now=new Date(), status=eventStatus(e);
  if(status==='Completed')return 'Completed';
  if(status==='Starting Soon'){const mins=Math.max(1,Math.round((start-now)/60000));return `Starting soon · in ${mins} min`}
  if(status==='Happening Today')return now>=start?'Happening today · live now':'Happening today';
  const days=Math.ceil((start-now)/86400000);
  return `Starts in ${days} day${days===1?'':'s'}`;
}
function popularity(e){return e.count+(interests.has(e.id)?1:0)}
function sortEvents(list){
  const arr=[...list];
  if(sortMode==='date-asc')return arr.sort((a,b)=>eventStartEnd(a).start-eventStartEnd(b).start);
  if(sortMode==='recent')return arr.sort((a,b)=>new Date(b.addedAt)-new Date(a.addedAt));
  if(sortMode==='popular')return arr.sort((a,b)=>popularity(b)-popularity(a));
  if(sortMode==='interested-first')return arr.sort((a,b)=>(interests.has(b.id)?1:0)-(interests.has(a.id)?1:0));
  return arr;
}
// Only ever called for saved events — conflicts are scoped to the user's own interests.
function findConflicts(id){
  if(!interests.has(id))return [];
  const target=events.find(e=>e.id===id), {start:ts,end:te}=eventStartEnd(target);
  return events.filter(e=>e.id!==id&&interests.has(e.id)).filter(e=>{
    const {start:s,end:en}=eventStartEnd(e);
    return isSameDay(ts,s)&&ts<en&&s<te;
  });
}
function visibleEvents(){return events.filter(e=>{const hay=`${e.title} ${e.category} ${e.organizer} ${e.venue}`.toLowerCase();return (selectedCategory==='All Events'||e.category===selectedCategory)&&(hay.includes(query.toLowerCase()))})}
function renderFilters(){ $('#filters').innerHTML=categories.map(c=>`<button type="button" class="filter" aria-pressed="${c===selectedCategory}" data-category="${c}">${c==='Hackathon'?'Hackathons':c==='Workshop'?'Workshops':c==='Seminar'?'Seminars':c==='Competition'?'Competitions':c}</button>`).join(''); }
function card(e){const saved=interests.has(e.id),status=eventStatus(e),conflicts=saved?findConflicts(e.id):[];return `<article class="event-card"><div class="event-meta"><span class="tag">${e.category}</span><span class="status${status==='Completed'?' is-completed':''}">${countdown(e)}</span></div><h3><button type="button" data-open="${e.id}">${e.title}</button></h3><p>${e.description.slice(0,104)}…</p><div class="event-info"><span>◷ ${fmtDate(e.date)} · ${e.time}</span><span>⌖ ${e.venue}</span><span>by ${e.organizer}</span></div>${conflicts.length?`<p class="conflict-warning">⚠ Overlaps with another saved event.</p>`:''}<div class="card-footer"><span class="people">${e.count + (saved?1:0)} interested</span><button class="interest-btn ${saved?'is-interested':''}" type="button" data-interest="${e.id}" aria-pressed="${saved}">${saved?'Interested ✓':'I’m interested'}</button></div></article>`}
function renderEvents(){const results=sortEvents(visibleEvents());grid.innerHTML=results.map(card).join('');$('#empty-state').hidden=results.length!==0;$('#result-note').textContent=query||selectedCategory!=='All Events'?`${results.length} event${results.length===1?'':'s'} found`:'';$('#upcoming-stat').textContent=String(events.length).padStart(2,'0');}
function persist(){localStorage.setItem('campus-interests',JSON.stringify([...interests]));localStorage.setItem('campus-reminders',JSON.stringify([...reminders]));}
let toastTimer;function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('visible'),2600)}
function toggleInterest(id){if(interests.has(id)){interests.delete(id);reminders.delete(id);toast('Removed from your interests.')}else{interests.add(id);toast('Saved to your interests.')}persist();renderAll();}
function categoryBreakdown(saved){const map={};saved.forEach(e=>{map[e.category]=(map[e.category]||0)+1});return Object.entries(map).sort((a,b)=>b[1]-a[1])}
function renderInterestsSummary(saved){
  const el=$('#interests-summary');
  if(!saved.length){el.innerHTML='';return}
  const upcoming=saved.filter(e=>eventStatus(e)!=='Completed').sort((a,b)=>eventStartEnd(a).start-eventStartEnd(b).start);
  const next=upcoming[0], breakdown=categoryBreakdown(saved);
  el.innerHTML=`<div class="summary-tile"><span>${padNum(saved.length)}</span><p>Total saved events</p></div><div class="summary-tile"><span>${padNum(upcoming.length)}</span><p>Upcoming saved events</p></div><div class="summary-tile next"><span>${next?fmtDate(next.date):'—'}</span><p>${next?`Next up: ${next.title}`:'No upcoming saved events'}</p></div><div class="summary-tile categories"><span>${breakdown.length}</span><p>${breakdown.length?breakdown.map(([c,n])=>`${c} (${n})`).join(' · '):'Saved by category'}</p></div>`;
}
function renderInterests(){const saved=events.filter(e=>interests.has(e.id));$('#nav-interest-count').textContent=saved.length;$('#interest-stat').textContent=String(saved.length).padStart(2,'0');renderInterestsSummary(saved);$('#interests-list').innerHTML=saved.length?saved.map(e=>{const d=dayParts(e.date), set=reminders.has(e.id), conflicts=findConflicts(e.id);return `<div class="interest-item"><div class="interest-date"><strong>${d.day}</strong>${d.month}</div><div class="interest-main"><h3>${e.title}</h3><p>${e.time} · ${e.venue} · ${countdown(e)}</p>${conflicts.length?`<p class="conflict-warning">⚠ You have another saved event during this time.</p>`:''}</div><button class="reminder-btn" type="button" data-reminder="${e.id}" aria-pressed="${set}">${set?'Reminder on':'Set reminder'}</button></div>`}).join(''):`<div class="empty-interests"><strong>You haven’t saved any events yet.</strong>Explore upcoming events and mark the ones you want to attend.</div>`}
function renderCalendar(){const y=calendarDate.getFullYear(),m=calendarDate.getMonth();$('#month-label').textContent=new Intl.DateTimeFormat('en-IN',{month:'long',year:'numeric'}).format(calendarDate);const first=new Date(y,m,1).getDay(), days=new Date(y,m+1,0).getDate(), dayEvents=events.reduce((a,e)=>{const d=new Date(e.date+'T12:00:00');if(d.getFullYear()===y&&d.getMonth()===m)(a[d.getDate()]??=[]).push(e);return a},{});let out='';for(let i=0;i<first;i++)out+='<button class="day" disabled aria-hidden="true"></button>';for(let d=1;d<=days;d++){const es=dayEvents[d]||[], sel=selectedDay===`${y}-${m}-${d}`;out+=`<button class="day ${es.length?'has-event':''} ${sel?'selected':''}" type="button" data-day="${d}" ${es.length?`aria-label="${d}, ${es.length} event${es.length>1?'s':''}"`:`aria-label="${d}, no events"`}>${d}</button>`}$('#calendar-grid').innerHTML=out}
function showDay(day){const y=calendarDate.getFullYear(),m=calendarDate.getMonth();selectedDay=`${y}-${m}-${day}`;const es=events.filter(e=>{const d=new Date(e.date+'T12:00:00');return d.getFullYear()===y&&d.getMonth()===m&&d.getDate()===Number(day)});$('#date-events').innerHTML=es.length?`<strong>${fmtDate(es[0].date)}</strong><br>${es.map(e=>e.title).join(' · ')}`:'No events scheduled for this date.';renderCalendar()}
function recommendedEvents(){
  const saved=events.filter(e=>interests.has(e.id)), notCompleted=e=>eventStatus(e)!=='Completed';
  if(!saved.length)return events.filter(notCompleted).sort((a,b)=>eventStartEnd(a).start-eventStartEnd(b).start).slice(0,3);
  const weights={};saved.forEach(e=>{weights[e.category]=(weights[e.category]||0)+1});
  return events.filter(e=>!interests.has(e.id)&&notCompleted(e)).sort((a,b)=>{
    const wa=weights[a.category]||0, wb=weights[b.category]||0;
    return wb!==wa?wb-wa:eventStartEnd(a).start-eventStartEnd(b).start;
  }).slice(0,3);
}
function renderRecommend(){const list=recommendedEvents(),section=$('#recommended');section.hidden=list.length===0;if(list.length)$('#recommend-grid').innerHTML=list.map(card).join('')}
function trackRecentlyViewed(id){id=Number(id);recentlyViewed=[id,...recentlyViewed.filter(x=>x!==id)].slice(0,5);localStorage.setItem('campus-recent',JSON.stringify(recentlyViewed));renderRecentlyViewed()}
function renderRecentlyViewed(){
  const list=recentlyViewed.map(id=>events.find(e=>e.id===id)).filter(Boolean), section=$('#recent-section');
  section.hidden=list.length===0;
  if(!list.length)return;
  $('#recent-list').innerHTML=list.map(e=>{const d=dayParts(e.date);return `<div class="interest-item"><div class="interest-date"><strong>${d.day}</strong>${d.month}</div><div class="interest-main"><h3><button type="button" data-open="${e.id}">${e.title}</button></h3><p>${e.category} · ${e.venue}</p></div></div>`}).join('');
}
function buildEventSummary(e){return `${e.title}\nCategory: ${e.category}\nDate: ${fmtDate(e.date)}\nTime: ${e.time}\nVenue: ${e.venue}\nOrganizer: ${e.organizer}`}
function copySummary(text){
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(()=>toast('Event details copied to clipboard.')).catch(()=>toast('Could not copy details. Please try again.'));
  }else{
    const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();
    try{document.execCommand('copy');toast('Event details copied to clipboard.')}catch(err){toast('Could not copy details. Please try again.')}
    ta.remove();
  }
}
async function shareEvent(id){
  const e=events.find(x=>x.id===Number(id)), summary=buildEventSummary(e);
  if(navigator.share){
    try{await navigator.share({title:e.title,text:summary})}catch(err){if(err&&err.name!=='AbortError')copySummary(summary)}
  }else{
    copySummary(summary);
  }
}
function icsEscape(s){return String(s).replace(/[\\;,]/g,m=>'\\'+m).replace(/\n/g,'\\n')}
function toICSDate(d){return `${d.getFullYear()}${padNum(d.getMonth()+1)}${padNum(d.getDate())}T${padNum(d.getHours())}${padNum(d.getMinutes())}00`}
function downloadICS(id){
  const e=events.find(x=>x.id===Number(id)), {start,end}=eventStartEnd(e);
  const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//MBIT Campus Events//EN','BEGIN:VEVENT',
    `UID:event-${e.id}@campus-events.mbit`,`DTSTAMP:${toICSDate(new Date())}`,`DTSTART:${toICSDate(start)}`,`DTEND:${toICSDate(end)}`,
    `SUMMARY:${icsEscape(e.title)}`,`DESCRIPTION:${icsEscape(e.description)}`,`LOCATION:${icsEscape(e.venue)}`,
    `ORGANIZER;CN=${icsEscape(e.organizer)}:MAILTO:noreply@mbit.edu`,'END:VEVENT','END:VCALENDAR'].join('\r\n');
  const blob=new Blob([ics],{type:'text/calendar;charset=utf-8'}), url=URL.createObjectURL(blob), a=document.createElement('a');
  a.href=url;a.download=`${e.title.replace(/[^a-z0-9]+/gi,'-')}.ics`;document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
  toast('Calendar file downloaded.');
}
function openDetails(id){
  trackRecentlyViewed(id);
  const e=events.find(x=>x.id===Number(id)),saved=interests.has(e.id),remind=reminders.has(e.id),conflicts=saved?findConflicts(e.id):[];
  $('#dialog-content').innerHTML=`<div class="dialog-inner"><span class="tag">${e.category}</span><h2 id="dialog-title">${e.title}</h2><p class="detail">${e.description}</p><div class="detail-grid"><div><strong>Date & time</strong>${fmtDate(e.date)}<br>${e.time}</div><div><strong>Location</strong>${e.venue}</div><div><strong>Organized by</strong>${e.organizer}</div><div><strong>Event status</strong>${countdown(e)} · ${e.count+(saved?1:0)} interested</div></div>${conflicts.length?`<p class="conflict-warning">⚠ You have another saved event during this time.</p>`:''}<div class="dialog-actions"><div class="dialog-utility-actions"><button class="reminder-btn" type="button" data-share="${e.id}">Share event</button><button class="reminder-btn" type="button" data-ics="${e.id}">Add to calendar</button></div><div class="dialog-primary-actions"><button class="reminder-btn" type="button" data-reminder="${e.id}" aria-pressed="${remind}" ${saved?'':'disabled'}>${remind?'Reminder on':'Set reminder'}</button><button class="interest-btn ${saved?'is-interested':''}" type="button" data-interest="${e.id}" aria-pressed="${saved}">${saved?'Interested ✓':'I’m interested'}</button></div></div></div>`;dialog.showModal()}
function renderAll(){renderFilters();renderEvents();renderInterests();renderCalendar();renderRecommend();renderRecentlyViewed()}
document.addEventListener('click',e=>{const f=e.target.closest('[data-category]');if(f){selectedCategory=f.dataset.category;renderAll()}const i=e.target.closest('[data-interest]');if(i){toggleInterest(Number(i.dataset.interest));if(dialog.open)openDetails(i.dataset.interest)}const r=e.target.closest('[data-reminder]');if(r){const id=Number(r.dataset.reminder);if(!interests.has(id))return;if(reminders.has(id)){reminders.delete(id);toast('Reminder turned off.')}else{reminders.add(id);toast('Reminder is on for this event.')}persist();renderInterests();if(dialog.open)openDetails(id)}const o=e.target.closest('[data-open]');if(o)openDetails(o.dataset.open);const d=e.target.closest('[data-day]');if(d)showDay(d.dataset.day);const sh=e.target.closest('[data-share]');if(sh)shareEvent(sh.dataset.share);const ics=e.target.closest('[data-ics]');if(ics)downloadICS(ics.dataset.ics);if(e.target.closest('.dialog-close'))dialog.close();if(e.target.closest('.menu-toggle')){$('.primary-nav').classList.toggle('open');const expanded=$('.primary-nav').classList.contains('open');$('.menu-toggle').setAttribute('aria-expanded',expanded)}});
$('#search-input').addEventListener('input',e=>{query=e.target.value;renderEvents()});$('#sort-select').addEventListener('change',e=>{sortMode=e.target.value;renderEvents()});$('#prev-month').onclick=()=>{calendarDate.setMonth(calendarDate.getMonth()-1);selectedDay=null;renderCalendar()};$('#next-month').onclick=()=>{calendarDate.setMonth(calendarDate.getMonth()+1);selectedDay=null;renderCalendar()};dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});renderAll();
