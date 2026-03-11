"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────
const HOUSES = ["Acoma", "Mayberry", "Noahs", "Bell"];
const SERVICE_TYPES = ["Individual", "Shared Meal", "House Meeting", "Community Support"];
const BARRIERS = ["Transportation","Isolation","Medication Management","Housing Instability","Financial Stress","Social Anxiety","Lack of Support","Substance Use Triggers"];
const EMOTIONS = ["Anxious","Hopeful","Frustrated","Motivated","Withdrawn","Stable","Overwhelmed","Content"];
const TOPICS = ["Recovery Goals","Daily Living Skills","Employment","Family Relationships","Mental Health","Substance Use","Housing","Community Integration"];
const INTERVENTIONS = ["Active Listening","Motivational Interviewing","Skill Building","Resource Navigation","Crisis De-escalation","Goal Setting","Peer Mentoring","Encouragement"];
const CLIENT_RESPONSES = ["Engaged positively","Initially resistant but opened up","Receptive to suggestions","Minimally verbal but present","Expressed gratitude","Showed motivation to change"];
const OUTCOMES = ["Goals identified","Action plan created","Referral provided","Improved mood noted","Skills practiced","Follow-up scheduled"];
const SETTINGS = ["Community","Home Visit","Office","Telehealth","Group Setting"];

const HOUSE_ACCENTS = {
  Acoma:   { grad:"linear-gradient(135deg,#3d4aff,#6b5fff)", glow:"rgba(61,74,255,0.15)",  border:"#3d4aff30", icon:"🏠" },
  Mayberry:{ grad:"linear-gradient(135deg,#059669,#10b981)", glow:"rgba(16,185,129,0.15)", border:"#10b98130", icon:"🌿" },
  Noahs:   { grad:"linear-gradient(135deg,#d97706,#f59e0b)", glow:"rgba(245,158,11,0.15)", border:"#f59e0b30", icon:"⚓" },
  Bell:    { grad:"linear-gradient(135deg,#db2777,#ec4899)", glow:"rgba(236,72,153,0.15)", border:"#ec489930", icon:"🔔" },
};

const STAFF_ACCOUNTS = [
  { id:1, name:"Nick Salazar",  email:"nick@barbellsaves.org",   password:"barbell2024", role:"Peer Specialist" },
  { id:2, name:"Elijah Torres", email:"elijah@barbellsaves.org", password:"barbell2024", role:"Peer Specialist" },
  { id:3, name:"Maria Reyes",   email:"maria@barbellsaves.org",  password:"barbell2024", role:"Supervisor" },
];

// ─── STORAGE ─────────────────────────────────────────────────────
const LS = {
  get:(k,fb=null)=>{ try{const v=localStorage.getItem(k);return v?JSON.parse(v):fb;}catch{return fb;} },
  set:(k,v)=>{ try{localStorage.setItem(k,JSON.stringify(v));}catch{} },
};

// ─── HELPERS ─────────────────────────────────────────────────────
function timeToMinutes(t){if(!t)return 0;const[h,m]=t.split(":").map(Number);return h*60+m;}
function formatDate(d){return d.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});}
function todayStr(){return new Date().toISOString().split("T")[0];}
function displayName(c){return `${c.firstName} ${c.lastName[0]}.`;}
function initials(c){return `${c.firstName[0]}${c.lastName[0]}`.toUpperCase();}

// ─── AVATAR ───────────────────────────────────────────────────────
function Avatar({client,size=48,accent}){
  const grad=accent?.grad||"linear-gradient(135deg,#3d4aff,#6b5fff)";
  if(client.photo){
    return <img src={client.photo} alt={displayName(client)}
      style={{width:size,height:size,borderRadius:"50%",objectFit:"cover",flexShrink:0,border:"2px solid #252736"}}/>;
  }
  return(
    <div style={{width:size,height:size,borderRadius:"50%",background:grad,display:"flex",alignItems:"center",
      justifyContent:"center",fontSize:size*0.33,fontWeight:700,color:"#fff",flexShrink:0,letterSpacing:"-0.02em"}}>
      {initials(client)}
    </div>
  );
}

// ─── AI NOTE GENERATION ──────────────────────────────────────────
async function generateSOAIPNote({client,house,duration,serviceType,barrier,emotion,topic,intervention,clientResponse,outcome,peer,startTime,endTime,sessionNotes}){
  const dl=duration===1?"1-hour":duration===2?"2-hour":"3-hour";
  const di=duration===1?"Write a concise interaction note (3-4 sentences per section).":duration===2?"Write a moderately detailed note (4-6 sentences per section).":"Write a thorough, multi-step interaction note (6-8 sentences per section) with multiple interventions documented.";
  const sn=sessionNotes?.trim()?`\n- Peer's Session Notes: ${sessionNotes.trim()}\n  (Incorporate these notes naturally into the SOAIP documentation)`:"";
  const prompt=`You are a documentation specialist for peer support services. Generate a SOAIP billing note.

Context:
- Peer Support Specialist: ${peer}
- Client: ${client}
- House: ${house}
- Service Type: ${serviceType}
- Duration: ${dl} (${startTime} - ${endTime})
- Barrier: ${barrier}
- Emotion at start: ${emotion}
- Topic discussed: ${topic}
- Intervention used: ${intervention}
- Client Response: ${clientResponse}
- Outcome: ${outcome}${sn}

${di}

Rules:
- Use peer support language only (no clinical, therapy, or diagnostic terms)
- Focus on recovery-oriented engagement, encouragement, and empowerment
- Document barrier removal, problem-solving, and emotional support
- All language must reflect peer-to-peer support, not clinical treatment
- Justify the ${dl} service duration through documentation depth

Output ONLY valid JSON (no markdown, no preamble):
{"subjective":"...","objective":"...","assessment":"...","intervention":"...","plan":"..."}`;

  const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:prompt}]})});
  const data=await res.json();
  const text=data.content?.map(b=>b.text||"").join("")||"";
  return JSON.parse(text.replace(/```json|```/g,"").trim());
}

// ═══════════════════════════════════════════════════════════════
// LOGIN SCREEN
// ═══════════════════════════════════════════════════════════════
function LoginScreen({onLogin}){
  const[email,setEmail]=useState("");
  const[password,setPassword]=useState("");
  const[error,setError]=useState("");
  const[loading,setLoading]=useState(false);

  const handleSubmit=async()=>{
    setError("");setLoading(true);
    await new Promise(r=>setTimeout(r,500));
    const staff=STAFF_ACCOUNTS.find(s=>s.email.toLowerCase()===email.toLowerCase()&&s.password===password);
    if(staff){LS.set("pb_session",{userId:staff.id});onLogin(staff);}
    else setError("Invalid email or password. Please try again.");
    setLoading(false);
  };

  const inp={width:"100%",background:"#1e2030",border:"1px solid #2e3148",borderRadius:8,padding:"12px 14px",color:"#e8e9f0",fontSize:15,outline:"none",boxSizing:"border-box",fontFamily:"inherit"};

  return(
    <div style={{minHeight:"100vh",background:"#0f1117",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans','Segoe UI',sans-serif",padding:"24px"}}>
      <style>{`*{box-sizing:border-box;} @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}`}</style>
      <div style={{width:"100%",maxWidth:400,animation:"fadeUp 0.4s ease"}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <div style={{width:60,height:60,borderRadius:18,background:"linear-gradient(135deg,#3d4aff,#6b5fff)",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:28,marginBottom:16,boxShadow:"0 8px 28px rgba(61,74,255,0.4)"}}>🏠</div>
          <div style={{fontSize:26,fontWeight:800,color:"#e8e9f0",letterSpacing:"-0.02em"}}>PeerBill</div>
          <div style={{fontSize:13,color:"#7a7d9a",marginTop:6}}>Barbell Saves Project · Staff Portal</div>
        </div>

        <div style={{background:"#161822",border:"1px solid #252736",borderRadius:16,padding:"32px 28px"}}>
          <div style={{fontSize:17,fontWeight:700,marginBottom:24,color:"#e8e9f0"}}>Sign in to your account</div>

          <div style={{marginBottom:16}}>
            <label style={{display:"block",fontSize:12,fontWeight:600,color:"#7a7d9a",marginBottom:6,letterSpacing:"0.06em"}}>EMAIL</label>
            <input style={inp} type="email" placeholder="you@barbellsaves.org" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/>
          </div>
          <div style={{marginBottom:24}}>
            <label style={{display:"block",fontSize:12,fontWeight:600,color:"#7a7d9a",marginBottom:6,letterSpacing:"0.06em"}}>PASSWORD</label>
            <input style={inp} type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/>
          </div>

          {error&&<div style={{marginBottom:16,padding:"10px 14px",background:"#3d1f1f",border:"1px solid #7f1d1d",borderRadius:8,fontSize:13,color:"#f87171"}}>{error}</div>}

          <button onClick={handleSubmit} disabled={loading||!email||!password}
            style={{width:"100%",padding:"13px",borderRadius:8,border:"none",background:loading||!email||!password?"#252736":"linear-gradient(135deg,#3d4aff,#6b5fff)",
              color:loading||!email||!password?"#5a5f80":"#fff",fontSize:15,fontWeight:700,cursor:loading||!email||!password?"not-allowed":"pointer",transition:"all 0.2s",
              boxShadow:loading||!email||!password?"none":"0 4px 16px rgba(61,74,255,0.3)",fontFamily:"inherit"}}>
            {loading?"Signing in…":"Sign In"}
          </button>

          <div style={{marginTop:20,padding:"12px 14px",background:"#1e2030",borderRadius:8,fontSize:12,color:"#5a5f80",lineHeight:1.6}}>
            <span style={{fontWeight:600,color:"#7a7d9a",display:"block",marginBottom:2}}>Demo credentials</span>
            nick@barbellsaves.org / barbell2024
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function App(){
  // Auth
  const[currentUser,setCurrentUser]=useState(()=>{
    const s=LS.get("pb_session");
    return s?STAFF_ACCOUNTS.find(a=>a.id===s.userId)||null:null;
  });

  // Data
  const[clients,setClients]=useState(()=>LS.get("pb_clients",[]));
  const[ledger,setLedger]=useState(()=>LS.get("pb_ledger",[]));
  useEffect(()=>{LS.set("pb_clients",clients);},[clients]);
  useEffect(()=>{LS.set("pb_ledger",ledger);},[ledger]);

  // Nav
  const[view,setView]=useState("dashboard");
  const[selectedHouse,setSelectedHouse]=useState(null);
  const[notification,setNotification]=useState(null);

  // Intake
  const[showIntake,setShowIntake]=useState(false);
  const[intake,setIntake]=useState({firstName:"",lastName:"",house:"",startDate:"",status:"Active",photo:null});
  const[intakeError,setIntakeError]=useState("");

  // Note form
  const[form,setForm]=useState(()=>LS.get("ps_draft",{house:"",clientId:"",duration:"",serviceType:"",startTime:"",endTime:"",barrier:"",emotion:"",topic:"",intervention:"",clientResponse:"",outcome:"",setting:"",sessionNotes:""}));
  const[clientSearch,setClientSearch]=useState("");
  const[showClientDropdown,setShowClientDropdown]=useState(false);
  const[generatedNote,setGeneratedNote]=useState(null);
  const[generating,setGenerating]=useState(false);
  const[copied,setCopied]=useState(false);
  const[overlapWarning,setOverlapWarning]=useState(null);
  const[pendingEntry,setPendingEntry]=useState(null);
  const[ledgerEntry,setLedgerEntry]=useState(null);
  const clientDropdownRef=useRef(null);

  useEffect(()=>{LS.set("ps_draft",form);},[form]);
  useEffect(()=>{
    const h=e=>{if(clientDropdownRef.current&&!clientDropdownRef.current.contains(e.target))setShowClientDropdown(false);};
    document.addEventListener("mousedown",h);return()=>document.removeEventListener("mousedown",h);
  },[]);

  // Voice dictation
  const[isListening,setIsListening]=useState(false);
  const[dictationError,setDictationError]=useState(null);
  const[voiceSupported]=useState(()=>typeof window!=="undefined"&&("SpeechRecognition" in window||"webkitSpeechRecognition" in window));
  const recognitionRef=useRef(null);
  const committedTextRef=useRef("");
  const shouldRestartRef=useRef(false);

  const startDictation=useCallback(()=>{
    if(!voiceSupported)return;
    setDictationError(null);
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    const rec=new SR();
    rec.lang="en-US";rec.continuous=true;rec.interimResults=true;rec.maxAlternatives=1;
    setForm(f=>{committedTextRef.current=f.sessionNotes||"";return f;});
    rec.onstart=()=>{setIsListening(true);shouldRestartRef.current=true;};
    rec.onresult=(ev)=>{
      let nf="",interim="";
      for(let i=ev.resultIndex;i<ev.results.length;i++){
        const t=ev.results[i][0].transcript;
        ev.results[i].isFinal?nf+=t:interim+=t;
      }
      if(nf){const b=committedTextRef.current;committedTextRef.current=b+(b&&!b.endsWith(" ")?" ":"")+nf;}
      const di=interim?(committedTextRef.current&&!committedTextRef.current.endsWith(" ")?" ":"")+interim:"";
      setForm(f=>({...f,sessionNotes:committedTextRef.current+di}));
    };
    rec.onend=()=>{
      setForm(f=>({...f,sessionNotes:committedTextRef.current}));
      if(shouldRestartRef.current&&recognitionRef.current){try{rec.start();}catch(_){}}
      else{setIsListening(false);recognitionRef.current=null;}
    };
    rec.onerror=(e)=>{
      if(e.error==="not-allowed"||e.error==="permission-denied"){setDictationError("denied");shouldRestartRef.current=false;setIsListening(false);recognitionRef.current=null;}
      else if(e.error!=="aborted")console.warn("SR:",e.error);
    };
    recognitionRef.current=rec;rec.start();
  },[voiceSupported]);

  const stopDictation=useCallback(()=>{
    shouldRestartRef.current=false;
    if(recognitionRef.current){recognitionRef.current.stop();recognitionRef.current=null;}
    setIsListening(false);
  },[]);

  useEffect(()=>()=>{shouldRestartRef.current=false;if(recognitionRef.current){recognitionRef.current.abort();recognitionRef.current=null;}},[]);

  // Helpers
  const showNotif=(msg,type="success")=>{setNotification({msg,type});setTimeout(()=>setNotification(null),3500);};
  const setField=(k,v)=>setForm(f=>({...f,[k]:v}));
  const selectedClient=clients.find(c=>c.id===form.clientId);
  const clientPool=form.house?clients.filter(c=>c.house===form.house):clients;
  const filteredClients=clientPool.filter(c=>displayName(c).toLowerCase().includes(clientSearch.toLowerCase())||c.house.toLowerCase().includes(clientSearch.toLowerCase()));

  const navigateToGenerate=(houseName,clientId=null)=>{
    setForm(f=>({...f,house:houseName,clientId:clientId||"",sessionNotes:""}));
    setClientSearch("");setGeneratedNote(null);setLedgerEntry(null);setView("generate");
  };

  const handleStartTime=(val)=>{
    setField("startTime",val);
    if(form.duration&&val){const m=timeToMinutes(val)+form.duration*60;setField("endTime",`${String(Math.floor(m/60)%24).padStart(2,"0")}:${String(m%60).padStart(2,"0")}`);}
  };
  const handleDuration=(d)=>{
    setField("duration",d);
    if(form.startTime){const m=timeToMinutes(form.startTime)+d*60;setField("endTime",`${String(Math.floor(m/60)%24).padStart(2,"0")}:${String(m%60).padStart(2,"0")}`);}
  };

  const checkOverlap=(entry)=>{
    const es=timeToMinutes(entry.startTime),ee=timeToMinutes(entry.endTime);
    return ledger.find(l=>{if(l.date!==entry.date)return false;const ls=timeToMinutes(l.startTime),le=timeToMinutes(l.endTime);return es<le&&ee>ls;});
  };

  const handleGenerate=async()=>{
    if(!form.house||!form.clientId||!form.duration||!form.serviceType){showNotif("Please fill in House, Client, Duration, and Service Type.","error");return;}
    setGenerating(true);setGeneratedNote(null);setLedgerEntry(null);
    try{
      const note=await generateSOAIPNote({
        client:selectedClient?displayName(selectedClient):"Client",house:form.house,duration:form.duration,serviceType:form.serviceType,
        barrier:form.barrier||"barrier to wellness",emotion:form.emotion||"neutral",topic:form.topic||"general recovery",
        intervention:form.intervention||"active listening",clientResponse:form.clientResponse||"engaged",outcome:form.outcome||"progress noted",
        peer:currentUser.name,startTime:form.startTime||"N/A",endTime:form.endTime||"N/A",setting:form.setting||"community",sessionNotes:form.sessionNotes||"",
      });
      setGeneratedNote(note);
    }catch(e){showNotif("Note generation failed. Check API connection.","error");}
    setGenerating(false);
  };

  const handleSave=()=>{
    if(!generatedNote)return;
    const entry={id:Date.now(),peer:currentUser.name,client:selectedClient?displayName(selectedClient):"Unknown",house:form.house,date:todayStr(),startTime:form.startTime,endTime:form.endTime,duration:form.duration,serviceType:form.serviceType,setting:form.setting,note:generatedNote};
    const conflict=checkOverlap(entry);
    if(conflict){setOverlapWarning(conflict);setPendingEntry(entry);return;}
    commitSave(entry);
  };

  const commitSave=(entry)=>{
    setLedger(l=>[entry,...l]);setLedgerEntry(entry);setOverlapWarning(null);setPendingEntry(null);showNotif("Note saved to ledger ✓");
  };

  const handleCopy=()=>{
    if(!generatedNote)return;
    navigator.clipboard.writeText(`SUBJECTIVE\n${generatedNote.subjective}\n\nOBJECTIVE\n${generatedNote.objective}\n\nASSESSMENT\n${generatedNote.assessment}\n\nINTERVENTION\n${generatedNote.intervention}\n\nPLAN\n${generatedNote.plan}`);
    setCopied(true);setTimeout(()=>setCopied(false),2000);
  };

  // Intake
  const handlePhotoUpload=(e)=>{
    const file=e.target.files[0];if(!file)return;
    const reader=new FileReader();
    reader.onload=(ev)=>setIntake(i=>({...i,photo:ev.target.result}));
    reader.readAsDataURL(file);
  };

  const handleIntakeSubmit=()=>{
    if(!intake.firstName.trim()||!intake.lastName.trim()||!intake.house){setIntakeError("First name, last name, and house are required.");return;}
    const c={id:Date.now(),firstName:intake.firstName.trim(),lastName:intake.lastName.trim(),house:intake.house,startDate:intake.startDate||todayStr(),status:intake.status,photo:intake.photo||null};
    setClients(prev=>[...prev,c]);
    setIntake({firstName:"",lastName:"",house:"",startDate:"",status:"Active",photo:null});
    setIntakeError("");setShowIntake(false);
    showNotif(`${displayName(c)} added to ${c.house} ✓`);
  };

  // Dashboard calcs
  const today=todayStr();
  const todayEntries=ledger.filter(e=>e.date===today);
  const todayHours=todayEntries.reduce((s,e)=>s+e.duration,0);
  const monthEntries=ledger.filter(e=>e.date.startsWith(today.slice(0,7)));
  const monthHours=monthEntries.reduce((s,e)=>s+e.duration,0);
  const clientTotalsToday={};
  todayEntries.forEach(e=>{clientTotalsToday[e.client]=(clientTotalsToday[e.client]||0)+e.duration;});
  const houseTotalsMonth={};
  monthEntries.forEach(e=>{houseTotalsMonth[e.house]=(houseTotalsMonth[e.house]||0)+e.duration;});

  // ─── STYLES ──────────────────────────────────────────────────
  const S={
    app:{minHeight:"100vh",background:"#0f1117",color:"#e8e9f0",fontFamily:"'DM Sans','Segoe UI',sans-serif",display:"flex",flexDirection:"column"},
    topbar:{background:"#161822",borderBottom:"1px solid #252736",padding:"0 20px",display:"flex",alignItems:"center",justifyContent:"space-between",height:60,position:"sticky",top:0,zIndex:100},
    logo:{fontSize:16,fontWeight:700,color:"#7b8cff",letterSpacing:"0.04em",display:"flex",alignItems:"center",gap:8},
    logoDot:{width:8,height:8,borderRadius:"50%",background:"#7b8cff",boxShadow:"0 0 8px #7b8cff"},
    nav:{background:"#161822",borderBottom:"1px solid #252736",padding:"0 20px",display:"flex",gap:2,overflowX:"auto"},
    navBtn:(a)=>({padding:"10px 14px",fontSize:13,fontWeight:a?600:400,color:a?"#7b8cff":"#7a7d9a",background:"none",border:"none",borderBottom:a?"2px solid #7b8cff":"2px solid transparent",cursor:"pointer",transition:"all 0.15s",whiteSpace:"nowrap"}),
    main:{flex:1,padding:"24px",maxWidth:900,margin:"0 auto",width:"100%",boxSizing:"border-box"},
    card:{background:"#161822",border:"1px solid #252736",borderRadius:12,padding:"20px 24px",marginBottom:16},
    cardTitle:{fontSize:13,fontWeight:600,color:"#7a7d9a",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:16},
    grid2:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12},
    label:{display:"block",fontSize:12,fontWeight:600,color:"#7a7d9a",marginBottom:6,letterSpacing:"0.06em"},
    input:{width:"100%",background:"#1e2030",border:"1px solid #2e3148",borderRadius:8,padding:"10px 12px",color:"#e8e9f0",fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"inherit"},
    select:{width:"100%",background:"#1e2030",border:"1px solid #2e3148",borderRadius:8,padding:"10px 12px",color:"#e8e9f0",fontSize:14,outline:"none",boxSizing:"border-box",cursor:"pointer"},
    durationBtn:(a)=>({flex:1,padding:"10px 0",fontSize:14,fontWeight:a?700:500,background:a?"linear-gradient(135deg,#3d4aff,#6b5fff)":"#1e2030",color:a?"#fff":"#7a7d9a",border:a?"1px solid #5a67ff":"1px solid #2e3148",borderRadius:8,cursor:"pointer",transition:"all 0.15s"}),
    btn:{padding:"12px 20px",borderRadius:8,fontSize:14,fontWeight:600,cursor:"pointer",border:"none",transition:"all 0.15s",fontFamily:"inherit"},
    btnPrimary:{background:"linear-gradient(135deg,#3d4aff,#6b5fff)",color:"#fff",boxShadow:"0 4px 16px rgba(91,103,255,0.3)"},
    btnSecondary:{background:"#1e2030",color:"#7b8cff",border:"1px solid #2e3148"},
    btnSuccess:{background:"linear-gradient(135deg,#22c55e,#16a34a)",color:"#fff"},
    btnDanger:{background:"#1e2030",color:"#f87171",border:"1px solid #3d1f1f"},
    soaipSection:{marginBottom:16},
    soaipLabel:{fontSize:11,fontWeight:700,color:"#7b8cff",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:4},
    soaipText:{fontSize:14,color:"#c8cae0",lineHeight:1.7},
    statNum:{fontSize:32,fontWeight:700,color:"#e8e9f0",lineHeight:1.1},
    statLabel:{fontSize:12,color:"#7a7d9a",marginTop:4},
    badge:(c)=>({display:"inline-block",padding:"2px 10px",borderRadius:20,fontSize:11,fontWeight:600,
      background:c==="blue"?"rgba(123,140,255,0.15)":c==="green"?"rgba(34,197,94,0.15)":c==="yellow"?"rgba(251,191,36,0.15)":"rgba(248,113,113,0.15)",
      color:c==="blue"?"#7b8cff":c==="green"?"#22c55e":c==="yellow"?"#fbbf24":"#f87171",letterSpacing:"0.04em"}),
    ledgerRow:{display:"flex",alignItems:"flex-start",gap:16,padding:"14px 0",borderBottom:"1px solid #1e2030"},
    ledgerDot:{width:8,height:8,borderRadius:"50%",background:"#7b8cff",marginTop:6,flexShrink:0,boxShadow:"0 0 6px #7b8cff80"},
    notif:(t)=>({position:"fixed",bottom:24,right:24,background:t==="error"?"#3d1f1f":"#1a2e1f",border:`1px solid ${t==="error"?"#7f1d1d":"#15803d"}`,color:t==="error"?"#f87171":"#4ade80",padding:"12px 20px",borderRadius:10,fontSize:14,fontWeight:600,zIndex:999,boxShadow:"0 8px 24px rgba(0,0,0,0.4)"}),
    modal:{position:"fixed",inset:0,background:"rgba(0,0,0,0.78)",display:"flex",alignItems:"flex-start",justifyContent:"center",zIndex:300,overflowY:"auto",padding:"32px 16px"},
    modalBox:{background:"#161822",border:"1px solid #252736",borderRadius:16,padding:"28px",maxWidth:520,width:"100%",marginBottom:32},
    overlapModal:{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200},
    overlapBox:{background:"#161822",border:"1px solid #f87171",borderRadius:14,padding:28,maxWidth:400,width:"90%"},
    spinner:{display:"inline-block",width:18,height:18,border:"2px solid rgba(255,255,255,0.2)",borderTop:"2px solid #fff",borderRadius:"50%",animation:"spin 0.8s linear infinite",marginRight:8,verticalAlign:"middle"},
  };

  if(!currentUser)return <LoginScreen onLogin={u=>setCurrentUser(u)}/>;

  // ─── VIEWS ───────────────────────────────────────────────────

  const renderDashboard=()=>(
    <div>
      <div style={{marginBottom:24}}>
        <div style={{fontSize:22,fontWeight:700}}>Dashboard</div>
        <div style={{fontSize:14,color:"#7a7d9a",marginTop:4}}>{formatDate(new Date())} · {currentUser.name}</div>
      </div>

      <div style={{...S.card,background:"linear-gradient(135deg,#1a1d35,#1e2238)",borderColor:"#3d4aff40"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
          <div>
            <div style={{fontSize:18,fontWeight:700}}>Generate a Note</div>
            <div style={{fontSize:13,color:"#7a7d9a",marginTop:4}}>Create a compliant SOAIP billing note in under 30 seconds</div>
          </div>
          <button style={{...S.btn,...S.btnPrimary,padding:"12px 24px"}} onClick={()=>setView("generate")}>+ New Note</button>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:16}}>
        {[["Today's Hours",todayHours,`${todayEntries.length} sessions`],["Month Hours",monthHours,`${monthEntries.length} sessions`],["Clients",clients.length,"enrolled"],["Notes",ledger.length,"total"]].map(([t,n,sub])=>(
          <div key={t} style={S.card}>
            <div style={S.cardTitle}>{t}</div>
            <div style={S.statNum}>{n}</div>
            <div style={S.statLabel}>{sub}</div>
          </div>
        ))}
      </div>

      <div style={S.card}>
        <div style={S.cardTitle}>Client Totals · Today</div>
        {Object.keys(clientTotalsToday).length===0
          ?<div style={{fontSize:13,color:"#7a7d9a"}}>No sessions recorded today</div>
          :Object.entries(clientTotalsToday).map(([c,h])=>(
            <div key={c} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #1e2030",fontSize:14}}>
              <span>{c}</span><span style={S.badge("blue")}>{h} hr{h!==1?"s":""}</span>
            </div>
          ))}
      </div>

      <div style={S.card}>
        <div style={S.cardTitle}>House Totals · This Month</div>
        <div style={S.grid2}>
          {HOUSES.map(h=>(
            <div key={h} onClick={()=>{setSelectedHouse(h);setView("houseDetail");}}
              style={{background:"#1e2030",borderRadius:8,padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",transition:"background 0.15s"}}
              onMouseEnter={e=>e.currentTarget.style.background="#252740"} onMouseLeave={e=>e.currentTarget.style.background="#1e2030"}>
              <span style={{fontSize:14,fontWeight:600}}>{h}</span>
              <span style={S.badge("blue")}>{houseTotalsMonth[h]||0} hrs</span>
            </div>
          ))}
        </div>
      </div>

      <div style={S.card}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div style={S.cardTitle}>Recent Entries</div>
          <button style={{...S.btn,...S.btnSecondary,padding:"6px 14px",fontSize:12}} onClick={()=>setView("ledger")}>View All</button>
        </div>
        {ledger.length===0
          ?<div style={{fontSize:13,color:"#7a7d9a"}}>No entries yet — generate your first note</div>
          :ledger.slice(0,3).map(e=>(
            <div key={e.id} style={S.ledgerRow}>
              <div style={S.ledgerDot}/>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:600}}>{e.client}</div>
                <div style={{fontSize:12,color:"#7a7d9a",marginTop:2}}>{e.house} · {e.serviceType} · {e.duration} hr{e.duration!==1?"s":""}</div>
              </div>
              <span style={S.badge("green")}>{e.date}</span>
            </div>
          ))}
      </div>
    </div>
  );

  const renderClients=()=>(
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24,flexWrap:"wrap",gap:12}}>
        <div>
          <div style={{fontSize:22,fontWeight:700}}>Clients</div>
          <div style={{fontSize:13,color:"#7a7d9a",marginTop:4}}>{clients.length} client{clients.length!==1?"s":""} enrolled</div>
        </div>
        <button style={{...S.btn,...S.btnPrimary}} onClick={()=>setShowIntake(true)}>+ Add Client</button>
      </div>

      {clients.length===0?(
        <div style={{...S.card,textAlign:"center",padding:52}}>
          <div style={{fontSize:44,marginBottom:14}}>👤</div>
          <div style={{fontSize:17,fontWeight:700,marginBottom:8}}>No clients yet</div>
          <div style={{fontSize:13,color:"#7a7d9a",marginBottom:20}}>Add your first client to begin tracking services</div>
          <button style={{...S.btn,...S.btnPrimary}} onClick={()=>setShowIntake(true)}>+ Add Client</button>
        </div>
      ):(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12}}>
          {clients.map(c=>{
            const hrs=ledger.filter(e=>e.client===displayName(c)).reduce((s,e)=>s+e.duration,0);
            const accent=HOUSE_ACCENTS[c.house]||HOUSE_ACCENTS.Acoma;
            return(
              <div key={c.id} style={{...S.card,marginBottom:0}}>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
                  <Avatar client={c} size={54} accent={accent}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:15,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{displayName(c)}</div>
                    <div style={{fontSize:12,color:"#7a7d9a",marginTop:2}}>{c.house}</div>
                  </div>
                </div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
                  <span style={S.badge(c.status==="Active"?"green":"yellow")}>{c.status}</span>
                  <span style={S.badge("blue")}>{hrs} hrs</span>
                </div>
                {c.startDate&&<div style={{fontSize:11,color:"#5a5f80",marginBottom:12}}>Since {c.startDate}</div>}
                <button style={{...S.btn,...S.btnSecondary,width:"100%",padding:"8px 0",fontSize:12}}
                  onClick={()=>navigateToGenerate(c.house,c.id)}>+ Generate Note</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderHouses=()=>(
    <div>
      <div style={{marginBottom:24}}>
        <div style={{fontSize:22,fontWeight:700}}>Houses</div>
        <div style={{fontSize:13,color:"#7a7d9a",marginTop:4}}>{HOUSES.length} houses · {clients.length} clients enrolled</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:16}}>
        {HOUSES.map(h=>{
          const accent=HOUSE_ACCENTS[h];
          const hc=clients.filter(c=>c.house===h);
          const hh=ledger.filter(e=>e.house===h).reduce((s,e)=>s+e.duration,0);
          return(
            <div key={h} onClick={()=>{setSelectedHouse(h);setView("houseDetail");}}
              style={{background:"#161822",border:`1px solid ${accent.border}`,borderRadius:14,padding:"22px 20px",cursor:"pointer",transition:"all 0.18s",position:"relative",overflow:"hidden"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 8px 28px ${accent.glow}`;}}
              onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>
              <div style={{position:"absolute",top:-20,right:-20,width:80,height:80,borderRadius:"50%",background:accent.glow,filter:"blur(20px)",pointerEvents:"none"}}/>
              <div style={{width:44,height:44,borderRadius:12,background:accent.grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,marginBottom:14,boxShadow:`0 4px 12px ${accent.glow}`}}>{accent.icon}</div>
              <div style={{fontSize:18,fontWeight:700,marginBottom:12}}>{h}</div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:12,color:"#7a7d9a"}}>Clients</span><span style={{fontSize:13,fontWeight:700}}>{hc.length}</span></div>
                <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:12,color:"#7a7d9a"}}>Total Hours</span><span style={{fontSize:13,fontWeight:700}}>{hh}</span></div>
              </div>
              <div style={{marginTop:16,fontSize:11,color:"#7b8cff",fontWeight:600}}>View Details →</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderHouseDetail=()=>{
    const h=selectedHouse;if(!h)return null;
    const accent=HOUSE_ACCENTS[h]||HOUSE_ACCENTS.Acoma;
    const houseClients=clients.filter(c=>c.house===h);
    const houseHrs=ledger.filter(e=>e.house===h).reduce((s,e)=>s+e.duration,0);
    const houseEntries=ledger.filter(e=>e.house===h);
    return(
      <div>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:20}}>
          <button onClick={()=>setView("houses")} style={{background:"none",border:"none",cursor:"pointer",color:"#7a7d9a",fontSize:13,padding:0}}>← Houses</button>
          <span style={{color:"#2e3148"}}>/</span>
          <span style={{fontSize:13,fontWeight:600}}>{h}</span>
        </div>

        <div style={{background:"linear-gradient(135deg,#1a1d2e,#1e2035)",border:`1px solid ${accent.border}`,borderRadius:14,padding:"22px 24px",marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
          <div style={{display:"flex",alignItems:"center",gap:16}}>
            <div style={{width:52,height:52,borderRadius:14,background:accent.grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>{accent.icon}</div>
            <div>
              <div style={{fontSize:24,fontWeight:800}}>{h}</div>
              <div style={{fontSize:13,color:"#7a7d9a",marginTop:2}}>{houseClients.length} clients · {houseHrs} hrs · {houseEntries.length} sessions</div>
            </div>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <button style={{...S.btn,...S.btnSecondary,padding:"10px 18px",fontSize:13}} onClick={()=>setShowIntake(true)}>+ Add Client</button>
            <button style={{...S.btn,...S.btnPrimary,padding:"10px 18px",fontSize:13}} onClick={()=>navigateToGenerate(h)}>+ Generate Note</button>
          </div>
        </div>

        <div style={{...S.cardTitle,marginBottom:12}}>Clients</div>
        {houseClients.length===0
          ?<div style={{...S.card,textAlign:"center",padding:32,color:"#7a7d9a"}}>No clients assigned to {h} yet. <button onClick={()=>setShowIntake(true)} style={{background:"none",border:"none",color:"#7b8cff",cursor:"pointer",fontWeight:600,fontSize:13}}>Add one →</button></div>
          :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12,marginBottom:24}}>
            {houseClients.map(c=>{
              const clientHrs=ledger.filter(e=>e.client===displayName(c)).reduce((s,e)=>s+e.duration,0);
              const lastEntry=ledger.filter(e=>e.client===displayName(c))[0];
              return(
                <div key={c.id} style={{background:"#161822",border:"1px solid #252736",borderRadius:12,padding:"18px 20px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
                    <Avatar client={c} size={46} accent={accent}/>
                    <div>
                      <div style={{fontSize:14,fontWeight:700}}>{displayName(c)}</div>
                      <div style={{fontSize:11,color:"#7a7d9a"}}>{c.house} · <span style={{color:c.status==="Active"?"#22c55e":"#fbbf24"}}>{c.status}</span></div>
                    </div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:12}}>
                    <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:12,color:"#7a7d9a"}}>Service Hours</span><span style={{fontSize:12,fontWeight:700}}>{clientHrs}</span></div>
                    <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:12,color:"#7a7d9a"}}>Biller</span><span style={{fontSize:12,fontWeight:700,color:lastEntry?"#e8e9f0":"#5a5f80"}}>{lastEntry?lastEntry.peer:"—"}</span></div>
                  </div>
                  <button style={{width:"100%",padding:"8px 0",borderRadius:7,fontSize:12,fontWeight:600,background:"#1e2030",border:`1px solid ${accent.border}`,color:"#e8e9f0",cursor:"pointer",fontFamily:"inherit"}}
                    onClick={()=>navigateToGenerate(h,c.id)}>
                    + Note for {c.firstName}
                  </button>
                </div>
              );
            })}
          </div>
        }

        {houseEntries.length>0&&(
          <>
            <div style={{...S.cardTitle,marginBottom:12}}>Recent Sessions</div>
            <div style={S.card}>
              {houseEntries.slice(0,5).map(e=>(
                <div key={e.id} style={S.ledgerRow}>
                  <div style={S.ledgerDot}/>
                  <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600}}>{e.client}</div><div style={{fontSize:12,color:"#7a7d9a",marginTop:2}}>{e.serviceType} · {e.peer}</div></div>
                  <div style={{textAlign:"right"}}><div style={S.badge("blue")}>{e.duration} hr{e.duration>1?"s":""}</div><div style={{fontSize:11,color:"#5a5f80",marginTop:3}}>{e.date}</div></div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  const renderGenerate=()=>(
    <div>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:22,fontWeight:700}}>Generate Note</div>
        <div style={{fontSize:13,color:"#7a7d9a",marginTop:4}}>Fill in the fields below to generate a compliant SOAIP note</div>
      </div>

      {/* Client Data */}
      <div style={S.card}>
        <div style={S.cardTitle}>Client Data</div>
        <div style={S.grid2}>
          <div>
            <label style={S.label}>House</label>
            <select style={S.select} value={form.house} onChange={e=>{setField("house",e.target.value);setField("clientId","");setClientSearch("");}}>
              <option value="">Select house...</option>
              {HOUSES.map(h=><option key={h} value={h}>{h}</option>)}
            </select>
          </div>
          <div>
            <label style={S.label}>
              Client {form.house&&<span style={{color:"#7b8cff",fontWeight:500,textTransform:"none",letterSpacing:0,marginLeft:6,fontSize:11}}>— {form.house} only</span>}
            </label>
            <div style={{position:"relative"}} ref={clientDropdownRef}>
              {selectedClient&&(
                <div style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",zIndex:2}}>
                  <Avatar client={selectedClient} size={24} accent={HOUSE_ACCENTS[selectedClient.house]}/>
                </div>
              )}
              <input style={{...S.input,paddingLeft:selectedClient?42:12}}
                placeholder={clients.length===0?"Add clients first…":"Search client…"}
                value={selectedClient?`${displayName(selectedClient)} — ${selectedClient.house}`:clientSearch}
                onChange={e=>{setClientSearch(e.target.value);setField("clientId","");setShowClientDropdown(true);}}
                onFocus={()=>setShowClientDropdown(true)}
                disabled={clients.length===0}
              />
              {showClientDropdown&&(
                <div style={{position:"absolute",top:"100%",left:0,right:0,background:"#1e2030",border:"1px solid #2e3148",borderRadius:8,zIndex:50,maxHeight:220,overflowY:"auto",marginTop:4,boxShadow:"0 8px 24px rgba(0,0,0,0.4)"}}>
                  {filteredClients.length===0
                    ?<div style={{padding:"10px 14px",fontSize:13,color:"#7a7d9a"}}>{form.house?"No clients in this house":"No clients found"}</div>
                    :filteredClients.map(c=>(
                      <div key={c.id} style={{padding:"8px 12px",fontSize:14,cursor:"pointer",borderBottom:"1px solid #252736",background:form.clientId===c.id?"#252736":"transparent",display:"flex",alignItems:"center",gap:10}}
                        onMouseDown={()=>{setField("clientId",c.id);setClientSearch("");setShowClientDropdown(false);}}>
                        <Avatar client={c} size={30} accent={HOUSE_ACCENTS[c.house]}/>
                        <span><span style={{fontWeight:600}}>{displayName(c)}</span><span style={{color:"#7a7d9a",marginLeft:8,fontSize:12}}>— {c.house}</span></span>
                      </div>
                    ))}
                </div>
              )}
            </div>
            {clients.length===0&&<div style={{marginTop:6,fontSize:11,color:"#f87171"}}>No clients yet. <button onClick={()=>setShowIntake(true)} style={{background:"none",border:"none",color:"#7b8cff",cursor:"pointer",fontSize:11,padding:0,fontWeight:600}}>Add a client →</button></div>}
          </div>
        </div>
      </div>

      {/* Service Data */}
      <div style={S.card}>
        <div style={S.cardTitle}>Service Data</div>
        <div style={{marginBottom:16}}>
          <label style={S.label}>Duration</label>
          <div style={{display:"flex",gap:8}}>{[1,2,3].map(d=><button key={d} style={S.durationBtn(form.duration===d)} onClick={()=>handleDuration(d)}>{d} hr{d>1?"s":""}</button>)}</div>
        </div>
        <div style={{marginBottom:16}}>
          <label style={S.label}>Service Type</label>
          <select style={S.select} value={form.serviceType} onChange={e=>setField("serviceType",e.target.value)}>
            <option value="">Select service type...</option>
            {SERVICE_TYPES.map(s=><option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div style={S.grid2}>
          <div><label style={S.label}>Start Time</label><input type="time" style={S.input} value={form.startTime} onChange={e=>handleStartTime(e.target.value)}/></div>
          <div><label style={S.label}>End Time</label><input type="time" style={S.input} value={form.endTime} onChange={e=>setField("endTime",e.target.value)}/></div>
        </div>
        <div style={{marginTop:16}}>
          <label style={S.label}>Setting</label>
          <select style={S.select} value={form.setting} onChange={e=>setField("setting",e.target.value)}>
            <option value="">Select setting...</option>
            {SETTINGS.map(s=><option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Note Details */}
      <div style={S.card}>
        <div style={S.cardTitle}>Note Details</div>
        <div style={S.grid2}>
          {[[BARRIERS,"barrier","Barrier"],[EMOTIONS,"emotion","Emotion"],[TOPICS,"topic","Topic"],[INTERVENTIONS,"intervention","Intervention"],[CLIENT_RESPONSES,"clientResponse","Client Response"],[OUTCOMES,"outcome","Outcome"]].map(([opts,key,lbl])=>(
            <div key={key}>
              <label style={S.label}>{lbl}</label>
              <select style={S.select} value={form[key]} onChange={e=>setField(key,e.target.value)}>
                <option value="">Select {lbl.toLowerCase()}...</option>
                {opts.map(o=><option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Session Notes + Voice */}
      <div style={S.card}>
        <div style={{...S.cardTitle,marginBottom:12}}>Session Notes <span style={{color:"#5a5f80",fontWeight:400,textTransform:"none",letterSpacing:0,fontSize:12}}>(optional)</span></div>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,flexWrap:"wrap"}}>
          {!voiceSupported
            ?<div style={{fontSize:12,color:"#f87171",padding:"8px 12px",background:"#3d1f1f",borderRadius:8,border:"1px solid #7f1d1d"}}>⚠ Voice dictation requires Chrome or Edge</div>
            :<button onClick={()=>isListening?stopDictation():startDictation()}
                style={{display:"flex",alignItems:"center",gap:8,padding:"9px 18px",borderRadius:8,border:isListening?"1px solid #f87171":"1px solid #2e3148",background:isListening?"linear-gradient(135deg,#3d1f1f,#4a1f1f)":"linear-gradient(135deg,#1e2030,#252740)",color:isListening?"#f87171":"#7b8cff",fontSize:13,fontWeight:600,cursor:"pointer",transition:"all 0.2s",boxShadow:isListening?"0 0 0 3px rgba(248,113,113,0.2)":"none",fontFamily:"inherit"}}>
                <span style={{fontSize:16}}>{isListening?"⏹":"🎤"}</span>
                {isListening?"Stop Dictation":"🎤 Dictate Note"}
                {isListening&&<span style={{width:8,height:8,borderRadius:"50%",background:"#f87171",animation:"pulse 1s ease-in-out infinite",display:"inline-block"}}/>}
              </button>
          }
          {isListening&&<div style={{fontSize:12,color:"#f87171",fontWeight:600,display:"flex",alignItems:"center",gap:6}}><span style={{width:6,height:6,borderRadius:"50%",background:"#f87171",display:"inline-block",animation:"pulse 1s ease-in-out infinite"}}/> Listening…</div>}
          {dictationError==="denied"&&!isListening&&(
            <div style={{fontSize:12,color:"#f87171",padding:"7px 12px",background:"#3d1f1f",borderRadius:8,border:"1px solid #7f1d1d",display:"flex",alignItems:"center",gap:6}}>
              🔒 Mic access denied.
              <button onClick={()=>setDictationError(null)} style={{background:"none",border:"none",color:"#f87171",cursor:"pointer",fontSize:14,padding:0}}>✕</button>
            </div>
          )}
        </div>
        <div style={{position:"relative"}}>
          <textarea style={{...S.input,minHeight:100,resize:"vertical",lineHeight:1.7,border:isListening?"1px solid rgba(248,113,113,0.5)":"1px solid #2e3148"}}
            placeholder={isListening?"Transcribing…":"Type or dictate session notes…"}
            value={form.sessionNotes} onChange={e=>setField("sessionNotes",e.target.value)}/>
          {form.sessionNotes&&<button onClick={()=>setField("sessionNotes","")} style={{position:"absolute",top:8,right:10,background:"none",border:"none",color:"#5a5f80",cursor:"pointer",fontSize:16,padding:2}}>✕</button>}
        </div>
        {form.sessionNotes&&<div style={{fontSize:11,color:"#5a5f80",marginTop:6,textAlign:"right"}}>{form.sessionNotes.trim().split(/\s+/).filter(Boolean).length} words</div>}
      </div>

      <button style={{...S.btn,...S.btnPrimary,width:"100%",marginBottom:16,padding:"14px",fontSize:15,opacity:generating?0.7:1}} onClick={handleGenerate} disabled={generating}>
        {generating?<><span style={S.spinner}/>Generating SOAIP Note…</>:"⚡ Generate SOAIP Note"}
      </button>

      {generatedNote&&(
        <>
          <div style={{...S.card,borderColor:"#3d4aff40"}}>
            <div style={{background:"#1e2030",borderRadius:8,padding:"14px 16px",marginBottom:20,fontSize:13}}>
              <div style={{...S.cardTitle,marginBottom:10}}>Billing Header</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px 24px",color:"#a0a3c0"}}>
                {[["Peer",currentUser.name],["Client",selectedClient?displayName(selectedClient):"—"],["House",form.house||"—"],["Date",formatDate(new Date())],["Start",form.startTime||"—"],["End",form.endTime||"—"],["Duration",form.duration?`${form.duration} hr${form.duration>1?"s":""}`:  "—"],["Service",form.serviceType||"—"],["Setting",form.setting||"—"]].map(([k,v])=>(
                  <div key={k} style={{display:"flex",gap:8}}><span style={{color:"#5a5f80",minWidth:60}}>{k}</span><span style={{color:"#e8e9f0",fontWeight:600}}>{v}</span></div>
                ))}
              </div>
            </div>
            <div style={S.cardTitle}>SOAIP Note</div>
            {[["Subjective",generatedNote.subjective],["Objective",generatedNote.objective],["Assessment",generatedNote.assessment],["Intervention",generatedNote.intervention],["Plan",generatedNote.plan]].map(([lbl,txt])=>(
              <div key={lbl} style={S.soaipSection}><div style={S.soaipLabel}>{lbl}</div><div style={S.soaipText}>{txt}</div></div>
            ))}
            <div style={{display:"flex",gap:10,marginTop:20,flexWrap:"wrap"}}>
              <button style={{...S.btn,...S.btnSuccess,flex:1}} onClick={handleSave}>Save to Ledger</button>
              <button style={{...S.btn,...(copied?S.btnSuccess:S.btnSecondary),flex:1}} onClick={handleCopy}>{copied?"✓ Copied!":"Copy SOAIP"}</button>
            </div>
          </div>
          {ledgerEntry&&(
            <div style={{...S.card,borderColor:"#22c55e40"}}>
              <div style={S.cardTitle}>✓ Ledger Entry Saved</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px 24px",fontSize:13}}>
                {[["Client",ledgerEntry.client],["House",ledgerEntry.house],["Date",ledgerEntry.date],["Duration",`${ledgerEntry.duration} hr${ledgerEntry.duration>1?"s":""}`],["Service",ledgerEntry.serviceType],["Peer",ledgerEntry.peer]].map(([k,v])=>(
                  <div key={k} style={{display:"flex",gap:8}}><span style={{color:"#5a5f80",minWidth:60}}>{k}</span><span style={{color:"#e8e9f0",fontWeight:600}}>{v}</span></div>
                ))}
              </div>
              <div style={{marginTop:12,padding:"10px 14px",background:"#1e2030",borderRadius:8,fontSize:13,color:"#a0a3c0"}}>
                <span style={{color:"#5a5f80",marginRight:8}}>Summary</span>{ledgerEntry.note.plan.slice(0,120)}…
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  const renderLedger=()=>(
    <div>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:22,fontWeight:700}}>Ledger</div>
        <div style={{fontSize:13,color:"#7a7d9a",marginTop:4}}>{ledger.length} total entries</div>
      </div>
      {ledger.length===0
        ?<div style={{...S.card,textAlign:"center",padding:40}}><div style={{fontSize:32,marginBottom:12}}>📋</div><div style={{fontSize:16,color:"#7a7d9a"}}>No entries yet</div></div>
        :ledger.map(e=>(
          <div key={e.id} style={S.card}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8,marginBottom:14}}>
              <div><div style={{fontSize:16,fontWeight:700}}>{e.client}</div><div style={{fontSize:12,color:"#7a7d9a",marginTop:3}}>{e.house} · {e.serviceType} · {e.peer}</div></div>
              <div style={{textAlign:"right"}}><div style={S.badge("blue")}>{e.duration} hr{e.duration>1?"s":""}</div><div style={{fontSize:12,color:"#7a7d9a",marginTop:4}}>{e.date} · {e.startTime}–{e.endTime}</div></div>
            </div>
            {[["S",e.note.subjective],["O",e.note.objective],["A",e.note.assessment],["I",e.note.intervention],["P",e.note.plan]].map(([sec,txt])=>(
              <div key={sec} style={{display:"flex",gap:10,marginBottom:8}}>
                <div style={{width:20,height:20,borderRadius:4,background:"#252736",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#7b8cff",flexShrink:0}}>{sec}</div>
                <div style={{fontSize:13,color:"#a0a3c0",lineHeight:1.6}}>{txt}</div>
              </div>
            ))}
          </div>
        ))}
    </div>
  );

  // ── Intake Modal ──
  const renderIntakeModal=()=>(
    <div style={S.modal} onClick={e=>{if(e.target===e.currentTarget){setShowIntake(false);setIntakeError("");}}}>
      <div style={S.modalBox}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
          <div style={{fontSize:18,fontWeight:700}}>Add New Client</div>
          <button onClick={()=>{setShowIntake(false);setIntakeError("");}} style={{background:"none",border:"none",color:"#7a7d9a",cursor:"pointer",fontSize:22,lineHeight:1,padding:0}}>✕</button>
        </div>

        {/* Photo */}
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{position:"relative",display:"inline-block"}}>
            {intake.photo
              ?<img src={intake.photo} alt="Preview" style={{width:84,height:84,borderRadius:"50%",objectFit:"cover",border:"3px solid #3d4aff60"}}/>
              :<div style={{width:84,height:84,borderRadius:"50%",background:"linear-gradient(135deg,#1e2030,#252740)",border:"2px dashed #2e3148",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:4}}>
                <span style={{fontSize:26}}>📷</span>
                <span style={{fontSize:10,color:"#5a5f80"}}>Photo</span>
              </div>
            }
            <label style={{position:"absolute",bottom:-4,right:-4,width:30,height:30,borderRadius:"50%",background:"linear-gradient(135deg,#3d4aff,#6b5fff)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:16,boxShadow:"0 2px 8px rgba(61,74,255,0.4)",color:"#fff",fontWeight:700}}>
              +<input type="file" accept="image/*" style={{display:"none"}} onChange={handlePhotoUpload}/>
            </label>
          </div>
          <div style={{fontSize:11,color:"#5a5f80",marginTop:10}}>Tap + to upload a client photo (optional)</div>
        </div>

        <div style={S.grid2}>
          <div><label style={S.label}>First Name *</label><input style={S.input} placeholder="Luis" value={intake.firstName} onChange={e=>setIntake(i=>({...i,firstName:e.target.value}))}/></div>
          <div><label style={S.label}>Last Name *</label><input style={S.input} placeholder="Mendoza" value={intake.lastName} onChange={e=>setIntake(i=>({...i,lastName:e.target.value}))}/></div>
        </div>
        <div style={{marginTop:12}}>
          <label style={S.label}>House Assignment *</label>
          <select style={S.select} value={intake.house} onChange={e=>setIntake(i=>({...i,house:e.target.value}))}>
            <option value="">Select house...</option>
            {HOUSES.map(h=><option key={h} value={h}>{h}</option>)}
          </select>
        </div>
        <div style={{...S.grid2,marginTop:12}}>
          <div><label style={S.label}>Program Start Date</label><input type="date" style={S.input} value={intake.startDate} onChange={e=>setIntake(i=>({...i,startDate:e.target.value}))}/></div>
          <div>
            <label style={S.label}>Status</label>
            <select style={S.select} value={intake.status} onChange={e=>setIntake(i=>({...i,status:e.target.value}))}>
              <option value="Active">Active</option>
              <option value="Discharged">Discharged</option>
            </select>
          </div>
        </div>

        {intakeError&&<div style={{marginTop:14,padding:"10px 14px",background:"#3d1f1f",border:"1px solid #7f1d1d",borderRadius:8,fontSize:13,color:"#f87171"}}>{intakeError}</div>}

        <div style={{display:"flex",gap:10,marginTop:20}}>
          <button style={{...S.btn,...S.btnSecondary,flex:1}} onClick={()=>{setShowIntake(false);setIntakeError("");}}>Cancel</button>
          <button style={{...S.btn,...S.btnPrimary,flex:2}} onClick={handleIntakeSubmit}>Add Client</button>
        </div>
      </div>
    </div>
  );

  // ─── RENDER ──────────────────────────────────────────────────
  return(
    <div style={S.app}>
      <style>{`
        *{box-sizing:border-box;}
        select option{background:#1e2030;}
        input[type="time"]::-webkit-calendar-picker-indicator{filter:invert(0.5);}
        input[type="date"]::-webkit-calendar-picker-indicator{filter:invert(0.5);}
        ::-webkit-scrollbar{width:6px;}
        ::-webkit-scrollbar-track{background:#0f1117;}
        ::-webkit-scrollbar-thumb{background:#252736;border-radius:3px;}
        @keyframes spin{to{transform:rotate(360deg);}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(1.3)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        textarea,input,select,button{font-family:inherit;}
      `}</style>

      {/* Topbar */}
      <div style={S.topbar}>
        <div style={S.logo}><div style={S.logoDot}/>PeerBill</div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{textAlign:"right",display:"flex",flexDirection:"column"}}>
            <span style={{fontSize:13,color:"#e8e9f0",fontWeight:600}}>{currentUser.name}</span>
            <span style={{fontSize:11,color:"#5a5f80"}}>{currentUser.role}</span>
          </div>
          <div style={{width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,#7b8cff,#a78bfa)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:"#fff"}}>{currentUser.name[0]}</div>
          <button onClick={()=>{LS.set("pb_session",null);setCurrentUser(null);}} style={{background:"none",border:"1px solid #252736",color:"#7a7d9a",cursor:"pointer",padding:"5px 11px",borderRadius:6,fontSize:12}}>Out</button>
        </div>
      </div>

      {/* Nav */}
      <div style={S.nav}>
        {[["dashboard","Dashboard"],["generate","Generate Note"],["ledger","Ledger"],["houses","Houses"],["clients","Clients"]].map(([v,lbl])=>(
          <button key={v} style={S.navBtn(view===v||(v==="houses"&&view==="houseDetail"))} onClick={()=>{if(v==="houses")setSelectedHouse(null);setView(v);}}>{lbl}</button>
        ))}
      </div>

      {/* Main */}
      <div style={S.main}>
        {view==="dashboard"   && renderDashboard()}
        {view==="generate"    && renderGenerate()}
        {view==="ledger"      && renderLedger()}
        {view==="houses"      && renderHouses()}
        {view==="houseDetail" && renderHouseDetail()}
        {view==="clients"     && renderClients()}
      </div>

      {/* Modals */}
      {showIntake&&renderIntakeModal()}

      {overlapWarning&&(
        <div style={S.overlapModal}>
          <div style={S.overlapBox}>
            <div style={{fontSize:16,fontWeight:700,color:"#f87171",marginBottom:10}}>⚠ Time Overlap Detected</div>
            <div style={{fontSize:13,color:"#a0a3c0",marginBottom:16}}>
              Existing service: <strong style={{color:"#e8e9f0"}}>{overlapWarning.client}</strong> {overlapWarning.startTime}–{overlapWarning.endTime}
            </div>
            <div style={{display:"flex",gap:8,flexDirection:"column"}}>
              <button style={{...S.btn,...S.btnDanger,width:"100%"}} onClick={()=>{setOverlapWarning(null);setPendingEntry(null);}}>Edit Time</button>
              <button style={{...S.btn,...S.btnSecondary,width:"100%"}} onClick={()=>commitSave(pendingEntry)}>Proceed Anyway</button>
              <button style={{...S.btn,background:"#1e2030",color:"#7a7d9a",border:"1px solid #2e3148",width:"100%"}} onClick={()=>{setOverlapWarning(null);setPendingEntry(null);}}>Cancel Entry</button>
            </div>
          </div>
        </div>
      )}

      {notification&&<div style={S.notif(notification.type)}>{notification.msg}</div>}
    </div>
  );
}
