import React, { useMemo, useState } from 'react';
import { Activity, Bell, CalendarDays, Check, ChevronRight, ClipboardList, Clock3, LayoutDashboard, LogOut, Menu, Pill, Plus, Search, Settings, ShieldCheck, ShoppingBag, Stethoscope, UserRound, X, HeartPulse, Trash2 } from 'lucide-react';

const initialMeds = [
  {id:1,name:'Vitamin D3',dose:'1 tablet · 1000 IU',time:'08:00 AM',stock:24,status:'Active',color:'violet'},
  {id:2,name:'Paracetamol',dose:'500 mg · After food',time:'02:00 PM',stock:12,status:'Active',color:'blue'},
  {id:3,name:'Omega 3',dose:'1 capsule · 1000 mg',time:'09:00 PM',stock:8,status:'Low stock',color:'orange'}
];
const nav = [
  ['Overview',LayoutDashboard],['My Medicines',Pill],['Reminders',Bell],['Prescriptions',ClipboardList],['Appointments',CalendarDays],['Orders',ShoppingBag]
];
function Dashboard({ onLogout }){
  const [page,setPage]=useState('Overview'),[mobile,setMobile]=useState(false),[query,setQuery]=useState('');
  const [meds,setMeds]=useState(()=>JSON.parse(localStorage.getItem('meds')||'null')||initialMeds);
  const [reminders,setReminders]=useState([{id:1,title:'Vitamin D3',time:'08:00 AM',date:'Today',done:true},{id:2,title:'Paracetamol',time:'02:00 PM',date:'Today',done:false},{id:3,title:'Omega 3',time:'09:00 PM',date:'Today',done:false}]);
  const [showAdd,setShowAdd]=useState(false),[form,setForm]=useState({name:'',dose:'',time:'08:00 AM'});
  const [toast,setToast]=useState('');
  const notify=(s)=>{setToast(s);setTimeout(()=>setToast(''),2400)};
  const saveMeds=(list)=>{setMeds(list);localStorage.setItem('meds',JSON.stringify(list))};
  const filtered=useMemo(()=>meds.filter(m=>m.name.toLowerCase().includes(query.toLowerCase())),[meds,query]);
  const addMedicine=(e)=>{e.preventDefault();if(!form.name.trim())return;saveMeds([...meds,{...form,id:Date.now(),stock:30,status:'Active',color:'green'}]);setForm({name:'',dose:'',time:'08:00 AM'});setShowAdd(false);notify('Medicine added successfully')};
  const toggleReminder=(id)=>setReminders(reminders.map(r=>r.id===id?{...r,done:!r.done}:r));
  const title=page==='Overview'?'Good morning, Asha 👋':page;
  return <div className="app-shell">
    <aside className={`sidebar ${mobile?'open':''}`}>
      <div className="brand"><div className="brand-icon"><HeartPulse size={23}/></div><div><b>MediCare</b><small>PHARMACY & WELLNESS</small></div><button className="close-nav" onClick={()=>setMobile(false)}><X/></button></div>
      <div className="nav-label">MENU</div>
      {nav.map(([name,Icon])=><button key={name} className={`nav-item ${page===name?'active':''}`} onClick={()=>{setPage(name);setMobile(false)}}><Icon size={18}/><span>{name}</span>{name==='Reminders'&&<i className="nav-count">2</i>}</button>)}
      <div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><ShieldCheck size={20}/></div><b>Your health matters</b><p>Keep your medicine schedule up to date.</p><button onClick={()=>notify('Your account is protected')}>Learn more <ChevronRight size={14}/></button></div><button className="nav-item" onClick={()=>notify('Settings coming soon')}><Settings size={18}/>Settings</button><button className="nav-item" onClick={onLogout}><LogOut size={18}/>Log out</button><div className="user-mini"><div className="avatar">AS</div><div><b>Asha Sharma</b><small>Patient account</small></div><span>•••</span></div></div>
    </aside>
    {mobile&&<div className="scrim" onClick={()=>setMobile(false)} />}
    <main className="main">
      <header className="topbar"><button className="menu-btn" onClick={()=>setMobile(true)}><Menu/></button><div className="breadcrumb">Pages <ChevronRight size={14}/> <b>{page}</b></div><div className="top-actions"><div className="searchbox"><Search size={17}/><input placeholder="Search medicines..." value={query} onChange={e=>{setQuery(e.target.value);if(page!=='My Medicines')setPage('My Medicines')}}/></div><button className="icon-btn notification" onClick={()=>setPage('Reminders')}><Bell size={19}/><i/></button><div className="avatar">AS</div></div></header>
      <section className="content">
        <div className="page-heading"><div><div className="eyebrow">WEDNESDAY, 18 NOVEMBER 2026</div><h1>{title}</h1><p>{page==='Overview'?'Here is your health summary for today.':`Manage and keep track of your ${page.toLowerCase()} in one place.`}</p></div>{page==='My Medicines'&&<button className="primary-btn" onClick={()=>setShowAdd(true)}><Plus size={17}/> Add medicine</button>}</div>
        {page==='Overview'&&<><div className="welcome-banner"><div><span className="banner-tag">YOUR DAILY HEALTH COMPANION</span><h2>Take care of yourself,<br/>one dose at a time.</h2><p>Small steps today make a healthier tomorrow.</p><button onClick={()=>setPage('Reminders')}>View today's schedule <ChevronRight size={16}/></button></div><div className="banner-art"><div className="art-circle"><Pill size={65}/></div><span className="spark s1">✦</span><span className="spark s2">✧</span></div></div>
        <div className="stats-grid"><Stat icon={Pill} label="Active medicines" value={meds.length} sub="In your medicine list" tone="purple"/><Stat icon={Bell} label="Today's reminders" value={reminders.length} sub={`${reminders.filter(r=>r.done).length} completed`} tone="blue"/><Stat icon={Activity} label="Adherence rate" value="86%" sub="Great consistency!" tone="green"/><Stat icon={CalendarDays} label="Upcoming visits" value="2" sub="Next: 22 November" tone="orange"/></div>
        <div className="two-col"><section className="panel"><PanelTitle title="Today's medicine schedule" action="See all" onClick={()=>setPage('Reminders')}/><div className="timeline">{reminders.map(r=><div className="timeline-row" key={r.id}><div className="time">{r.time}</div><div className={`status-dot ${r.done?'done':''}`}></div><div className="schedule-info"><b>{r.title}</b><small>{r.done?'Dose marked as taken':'Scheduled dose'}</small></div><button className={`check-btn ${r.done?'checked':''}`} onClick={()=>toggleReminder(r.id)}>{r.done?<Check size={16}/>: 'Mark taken'}</button></div>)}</div></section><section className="panel"><PanelTitle title="Medicine inventory" action="Manage" onClick={()=>setPage('My Medicines')}/>{meds.slice(0,3).map(m=><div className="inventory-row" key={m.id}><div className={`medicine-icon ${m.color}`}><Pill size={19}/></div><div className="inventory-info"><b>{m.name}</b><small>{m.stock} tablets / capsules left</small><div className="progress"><span style={{width:`${Math.min(m.stock*3,100)}%`}}/></div></div><span className={`pill-tag ${m.status==='Low stock'?'warning':''}`}>{m.status}</span></div>)}</section></div>
        <div className="panel tip-panel"><div className="tip-icon">💡</div><div><b>Health tip of the day</b><p>Try to take your medicines at the same time every day. A consistent routine can help you stay on track.</p></div></div></>}
        {page==='My Medicines'&&<section className="panel"><PanelTitle title="Your medicine list" action={`${filtered.length} medicines`}/><div className="table-wrap"><table><thead><tr><th>MEDICINE</th><th>DOSAGE</th><th>REMINDER TIME</th><th>STOCK</th><th>STATUS</th><th></th></tr></thead><tbody>{filtered.map(m=><tr key={m.id}><td><div className="table-med"><div className={`medicine-icon ${m.color}`}><Pill size={17}/></div><b>{m.name}</b></div></td><td>{m.dose||'—'}</td><td>{m.time}</td><td>{m.stock} units</td><td><span className={`pill-tag ${m.status==='Low stock'?'warning':''}`}>{m.status}</span></td><td><button className="delete-btn" onClick={()=>{saveMeds(meds.filter(x=>x.id!==m.id));notify('Medicine removed')}}><Trash2 size={16}/></button></td></tr>)}</tbody></table>{filtered.length===0&&<div className="empty">No medicines found.</div>}</div></section>}
        {page==='Reminders'&&<section className="panel"><PanelTitle title="Today's reminders" action={`${reminders.filter(r=>!r.done).length} remaining`}/><div className="reminder-list">{reminders.map(r=><div className="reminder-card" key={r.id}><div className="reminder-clock"><Clock3/></div><div className="reminder-copy"><b>{r.title}</b><small>{r.date} · {r.time}</small></div><span className={`pill-tag ${r.done?'success':''}`}>{r.done?'Taken':'Upcoming'}</span><button className={`check-btn ${r.done?'checked':''}`} onClick={()=>toggleReminder(r.id)}>{r.done?<Check size={16}/>: 'Mark as taken'}</button></div>)}</div></section>}
        {page==='Prescriptions'&&<section className="panel"><PanelTitle title="My prescriptions" action="2 records"/><Record icon={ClipboardList} title="General health prescription" meta="Dr. Mehta · 12 November 2026" status="Active"/><Record icon={ClipboardList} title="Vitamin supplement plan" meta="Dr. Mehta · 04 November 2026" status="Active"/></section>}
        {page==='Appointments'&&<section className="panel"><PanelTitle title="Upcoming appointments" action="2 scheduled"/><Record icon={Stethoscope} title="General physician consultation" meta="22 November 2026 · 10:30 AM" status="Confirmed"/><Record icon={Stethoscope} title="Follow-up consultation" meta="05 December 2026 · 11:00 AM" status="Confirmed"/></section>}
        {page==='Orders'&&<section className="panel"><PanelTitle title="Medicine orders" action="1 order"/><Record icon={ShoppingBag} title="Vitamin D3 · 1 pack" meta="Order #MED-2026-1042 · 14 November 2026" status="Processing"/></section>}
      </section>
      <footer>© 2026 MediCare · Pharmacy & Medicine Reminder Management System <span>Made with care <HeartPulse size={13}/></span></footer>
    </main>
    {showAdd&&<div className="modal-backdrop" onClick={()=>setShowAdd(false)}><form className="modal" onClick={e=>e.stopPropagation()} onSubmit={addMedicine}><div className="modal-head"><div><h2>Add a medicine</h2><p>Enter the details for your medicine.</p></div><button type="button" className="icon-btn" onClick={()=>setShowAdd(false)}><X/></button></div><label>Medicine name<input required placeholder="e.g. Vitamin C" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label><label>Dosage / instructions<input placeholder="e.g. 1 tablet after food" value={form.dose} onChange={e=>setForm({...form,dose:e.target.value})}/></label><label>Reminder time<input value={form.time} onChange={e=>setForm({...form,time:e.target.value})} placeholder="e.g. 08:00 AM"/></label><button className="primary-btn full" type="submit"><Plus size={17}/> Save medicine</button></form></div>}
    {toast&&<div className="toast"><Check size={17}/>{toast}</div>}
  </div>
}
function Stat({icon:Icon,label,value,sub,tone}){return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={20}/></div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-sub">{sub}</div></div>}
function PanelTitle({title,action,onClick}){return <div className="panel-title"><h3>{title}</h3>{action&&<button onClick={onClick}>{action} <ChevronRight size={15}/></button>}</div>}
function Record({icon:Icon,title,meta,status}){return <div className="record-row"><div className="medicine-icon blue"><Icon size={19}/></div><div className="record-info"><b>{title}</b><small>{meta}</small></div><span className="pill-tag success">{status}</span></div>}

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    onLogin(email.trim());
  };

  return <div className="login-screen">
    <div className="login-decoration login-decoration-one"></div>
    <div className="login-decoration login-decoration-two"></div>
    <div className="login-card">
      <div className="login-brand">
        <div className="login-brand-icon"><HeartPulse size={27}/></div>
        <div><strong>MediCare</strong><span>PHARMACY & WELLNESS</span></div>
      </div>
      <div className="login-welcome">
        <span className="login-kicker">WELCOME BACK</span>
        <h1>Sign in to your account</h1>
        <p>Manage your medicines and stay on track with your health.</p>
      </div>
      <form onSubmit={submit} className="login-form">
        <label htmlFor="login-email">Email address</label>
        <div className="login-input-wrap"><UserRound size={18}/><input id="login-email" type="email" autoComplete="username" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} required/></div>
        <div className="login-password-label"><label htmlFor="login-password">Password</label><span>Required</span></div>
        <div className="login-input-wrap"><ShieldCheck size={18}/><input id="login-password" type={showPassword?'text':'password'} autoComplete="current-password" placeholder="Enter your password" value={password} onChange={e=>setPassword(e.target.value)} required/><button type="button" className="show-password" onClick={()=>setShowPassword(!showPassword)}>{showPassword?'Hide':'Show'}</button></div>
        {error && <div className="login-error">{error}</div>}
        <div className="login-options"><label className="remember-label"><input type="checkbox"/> Remember me</label><span className="forgot-text">Forgot password?</span></div>
        <button className="login-submit" type="submit">Sign in <ChevronRight size={18}/></button>
      </form>
      <div className="login-demo"><b>Demo access</b><span>Enter any valid email address and a password to view the sample dashboard.</span></div>
      <div className="login-footer">© 2026 MediCare · Your daily health companion</div>
    </div>
    <div className="login-side-note"><div className="login-side-icon"><Pill size={34}/></div><h2>One simple place<br/>for your daily care.</h2><p>Keep your medicines, reminders and appointments organised.</p><div className="login-side-points"><span><Check size={15}/> Medicine tracking</span><span><Check size={15}/> Daily reminders</span><span><Check size={15}/> Health overview</span></div></div>
  </div>;
}

function App() {
  const [signedIn, setSignedIn] = useState(() => sessionStorage.getItem('medicare-demo-signed-in') === 'true');
  const login = (email) => {
    setSignedIn(true);
    sessionStorage.setItem('medicare-demo-signed-in', 'true');
    sessionStorage.setItem('medicare-demo-email', email);
  };
  const logout = () => {
    sessionStorage.removeItem('medicare-demo-signed-in');
    sessionStorage.removeItem('medicare-demo-email');
    setSignedIn(false);
  };
  if (!signedIn) return <Login onLogin={login}/>;
  return <Dashboard onLogout={logout}/>;
}

export default App;