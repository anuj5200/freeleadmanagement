import { useState, useEffect } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────
const STAGES = ["New Lead","Contacted","Interested","Demo","Proposal Shared","Follow-up","Not Interested","Converted","Lost"];
const STAGE_COLORS = {
  "New Lead": "#6366f1","Contacted": "#0ea5e9","Interested": "#f59e0b",
  "Demo": "#8b5cf6","Proposal Shared": "#ec4899","Follow-up": "#f97316",
  "Not Interested": "#94a3b8","Converted": "#10b981","Lost": "#ef4444"
};
const SOURCES = ["Meta Lead Ads","Google Ads","Google Sheets","Excel Upload","Manual","Referral","Website"];

const SAMPLE_LEADS = [
  { id:1, name:"Priya Sharma", phone:"9876543210", email:"priya@email.com", source:"Meta Lead Ads", campaign:"Summer Sale", stage:"New Lead", assignedTo:"Rahul", createdAt:"2024-01-15", value:15000, notes:[], followUp:null, calls:[] },
  { id:2, name:"Amit Gupta", phone:"9123456780", email:"amit@email.com", source:"Google Ads", campaign:"Brand Awareness", stage:"Contacted", assignedTo:"Sneha", createdAt:"2024-01-14", value:28000, notes:[{text:"Very interested in premium plan", date:"2024-01-14"}], followUp:"2024-01-20", calls:[] },
  { id:3, name:"Kavya Reddy", phone:"9988776655", email:"kavya@email.com", source:"Referral", campaign:"", stage:"Interested", assignedTo:"Rahul", createdAt:"2024-01-13", value:45000, notes:[], followUp:"2024-01-18", calls:[{type:"Outgoing",duration:"5 min",outcome:"Positive",date:"2024-01-13"}] },
  { id:4, name:"Rohan Mehta", phone:"9765432109", email:"rohan@email.com", source:"Website", campaign:"", stage:"Demo", assignedTo:"Sneha", createdAt:"2024-01-12", value:32000, notes:[{text:"Demo scheduled for Friday",date:"2024-01-12"}], followUp:"2024-01-19", calls:[] },
  { id:5, name:"Deepa Nair", phone:"9654321098", email:"deepa@email.com", source:"Meta Lead Ads", campaign:"New Year Offer", stage:"Converted", assignedTo:"Rahul", createdAt:"2024-01-10", value:55000, notes:[], followUp:null, calls:[] },
  { id:6, name:"Vikram Singh", phone:"9543210987", email:"vikram@email.com", source:"Google Ads", campaign:"Brand Awareness", stage:"Lost", assignedTo:"Sneha", createdAt:"2024-01-09", value:18000, notes:[{text:"Budget constraints",date:"2024-01-11"}], followUp:null, calls:[] },
];

const SAMPLE_USERS = [
  { id:1, name:"Rahul Kumar", email:"rahul@flm.com", role:"Sales", leads:3, converted:1 },
  { id:2, name:"Sneha Patel", email:"sneha@flm.com", role:"Sales", leads:3, converted:0 },
];

// ─── Icons (SVG inline) ───────────────────────────────────────────────────────
const Icon = ({ d, size=18, color="currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d}/>
  </svg>
);
const Icons = {
  dashboard: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  leads: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  pipeline: "M3 3h6v6H3z M15 3h6v6h-6z M3 15h6v6H3z M15 15h6v6h-6z",
  whatsapp: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z",
  team: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
  plus: "M12 5v14 M5 12h14",
  close: "M18 6L6 18 M6 6l12 12",
  phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z",
  note: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  trash: "M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
  bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0",
  chart: "M18 20V10 M12 20V4 M6 20v-6",
  search: "M11 17.25a6.25 6.25 0 1 1 0-12.5 6.25 6.25 0 0 1 0 12.5z M16 16l3.5 3.5",
  chevron: "M9 18l6-6-6-6",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0a0e1a; --surface: #111827; --surface2: #1a2235; --surface3: #1f2d42;
    --border: #1e2d45; --accent: #00d4ff; --accent2: #7c3aed; --accent3: #10b981;
    --text: #e2e8f0; --text2: #94a3b8; --text3: #64748b;
    --green: #10b981; --red: #ef4444; --yellow: #f59e0b; --purple: #8b5cf6;
    --font: 'Sora', sans-serif; --mono: 'JetBrains Mono', monospace;
  }
  body { background: var(--bg); color: var(--text); font-family: var(--font); }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: var(--surface); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
  input, select, textarea { font-family: var(--font); }

  .app { display: flex; height: 100vh; overflow: hidden; }

  /* Sidebar */
  .sidebar {
    width: 220px; min-width: 220px; background: var(--surface);
    border-right: 1px solid var(--border); display: flex; flex-direction: column;
    padding: 0; overflow: hidden;
  }
  .sidebar-logo {
    padding: 20px 18px 16px; border-bottom: 1px solid var(--border);
  }
  .logo-text { font-size: 13px; font-weight: 700; letter-spacing: 0.05em; color: var(--accent); text-transform: uppercase; }
  .logo-sub { font-size: 10px; color: var(--text3); margin-top: 2px; font-family: var(--mono); }
  .sidebar-nav { flex: 1; padding: 12px 10px; display: flex; flex-direction: column; gap: 2px; overflow-y: auto; }
  .nav-item {
    display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 8px;
    cursor: pointer; transition: all 0.15s; color: var(--text2); font-size: 13px; font-weight: 500;
    border: 1px solid transparent;
  }
  .nav-item:hover { background: var(--surface2); color: var(--text); }
  .nav-item.active { background: rgba(0,212,255,0.08); color: var(--accent); border-color: rgba(0,212,255,0.15); }
  .sidebar-footer { padding: 12px 10px; border-top: 1px solid var(--border); }
  .user-badge {
    display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 8px;
    background: var(--surface2); cursor: pointer;
  }
  .avatar { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, var(--accent2), var(--accent)); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: white; flex-shrink: 0; }
  .user-name { font-size: 12px; font-weight: 600; }
  .user-role { font-size: 10px; color: var(--text3); }

  /* Main */
  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  .topbar {
    height: 56px; min-height: 56px; background: var(--surface); border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between; padding: 0 24px;
  }
  .page-title { font-size: 16px; font-weight: 700; }
  .topbar-right { display: flex; align-items: center; gap: 12px; }
  .btn {
    display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 8px;
    font-size: 12px; font-weight: 600; cursor: pointer; border: none; transition: all 0.15s; font-family: var(--font);
  }
  .btn-primary { background: var(--accent); color: #000; }
  .btn-primary:hover { background: #00bde6; }
  .btn-secondary { background: var(--surface2); color: var(--text); border: 1px solid var(--border); }
  .btn-secondary:hover { background: var(--surface3); }
  .btn-ghost { background: transparent; color: var(--text2); border: 1px solid var(--border); }
  .btn-ghost:hover { background: var(--surface2); color: var(--text); }
  .btn-danger { background: rgba(239,68,68,0.1); color: var(--red); border: 1px solid rgba(239,68,68,0.2); }
  .btn-success { background: rgba(16,185,129,0.1); color: var(--green); border: 1px solid rgba(16,185,129,0.2); }
  .btn-sm { padding: 5px 10px; font-size: 11px; }

  .content { flex: 1; overflow-y: auto; padding: 24px; }

  /* Dashboard */
  .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
  .stat-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: 12px;
    padding: 18px 20px; position: relative; overflow: hidden;
  }
  .stat-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; }
  .stat-card.c1::before { background: linear-gradient(90deg, var(--accent), transparent); }
  .stat-card.c2::before { background: linear-gradient(90deg, var(--green), transparent); }
  .stat-card.c3::before { background: linear-gradient(90deg, var(--yellow), transparent); }
  .stat-card.c4::before { background: linear-gradient(90deg, var(--purple), transparent); }
  .stat-label { font-size: 11px; color: var(--text3); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; }
  .stat-value { font-size: 28px; font-weight: 700; margin: 6px 0 4px; font-family: var(--mono); }
  .stat-sub { font-size: 11px; color: var(--text3); }

  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 18px 20px; }
  .card-title { font-size: 13px; font-weight: 700; margin-bottom: 14px; color: var(--text); }

  /* Pipeline */
  .pipeline-scroll { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 12px; min-height: calc(100vh - 160px); }
  .pipeline-col {
    min-width: 220px; width: 220px; background: var(--surface); border: 1px solid var(--border);
    border-radius: 12px; display: flex; flex-direction: column; max-height: calc(100vh - 160px);
  }
  .col-header { padding: 12px 14px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .col-title { font-size: 12px; font-weight: 700; }
  .col-count { font-size: 11px; background: var(--surface2); color: var(--text3); padding: 2px 7px; border-radius: 20px; font-family: var(--mono); }
  .col-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .col-body { flex: 1; overflow-y: auto; padding: 10px; display: flex; flex-direction: column; gap: 8px; }
  .lead-card {
    background: var(--surface2); border: 1px solid var(--border); border-radius: 8px;
    padding: 12px; cursor: pointer; transition: all 0.15s;
  }
  .lead-card:hover { border-color: var(--accent); background: var(--surface3); }
  .lead-name { font-size: 12px; font-weight: 600; margin-bottom: 4px; }
  .lead-phone { font-size: 11px; color: var(--text3); font-family: var(--mono); margin-bottom: 8px; }
  .lead-meta { display: flex; align-items: center; justify-content: space-between; }
  .source-tag { font-size: 10px; color: var(--text3); background: var(--surface3); padding: 2px 6px; border-radius: 4px; }
  .wa-btn {
    width: 26px; height: 26px; border-radius: 6px; background: rgba(37,211,102,0.12);
    border: 1px solid rgba(37,211,102,0.25); display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #25d366; transition: all 0.15s; flex-shrink: 0;
  }
  .wa-btn:hover { background: rgba(37,211,102,0.25); }
  .value-tag { font-size: 10px; color: var(--green); font-family: var(--mono); }

  /* Lead Table */
  .search-bar {
    display: flex; align-items: center; gap: 12px; margin-bottom: 16px; flex-wrap: wrap;
  }
  .search-input {
    flex: 1; min-width: 200px; background: var(--surface); border: 1px solid var(--border);
    border-radius: 8px; padding: 8px 14px 8px 36px; color: var(--text); font-size: 13px;
    outline: none; transition: border-color 0.15s;
  }
  .search-input:focus { border-color: var(--accent); }
  .search-wrap { position: relative; flex: 1; min-width: 200px; }
  .search-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: var(--text3); }
  select.filter-sel {
    background: var(--surface); border: 1px solid var(--border); border-radius: 8px;
    padding: 8px 12px; color: var(--text); font-size: 12px; outline: none; cursor: pointer;
  }
  select.filter-sel:focus { border-color: var(--accent); }

  table { width: 100%; border-collapse: collapse; }
  thead th { text-align: left; font-size: 11px; font-weight: 700; color: var(--text3); text-transform: uppercase; letter-spacing: 0.06em; padding: 10px 14px; border-bottom: 1px solid var(--border); }
  tbody tr { border-bottom: 1px solid var(--border); transition: background 0.1s; }
  tbody tr:hover { background: var(--surface2); }
  tbody td { padding: 12px 14px; font-size: 13px; }
  tbody tr:last-child { border-bottom: none; }

  .stage-badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 9px; border-radius: 20px; font-size: 11px; font-weight: 600; }

  /* Modal */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 100;
    display: flex; align-items: center; justify-content: center; padding: 20px;
    backdrop-filter: blur(4px);
  }
  .modal {
    background: var(--surface); border: 1px solid var(--border); border-radius: 16px;
    width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto;
  }
  .modal-header {
    padding: 20px 24px 16px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }
  .modal-title { font-size: 15px; font-weight: 700; }
  .modal-body { padding: 20px 24px; }
  .modal-footer { padding: 16px 24px; border-top: 1px solid var(--border); display: flex; gap: 10px; justify-content: flex-end; }

  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
  .form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
  .form-group.full { grid-column: 1 / -1; }
  label { font-size: 11px; font-weight: 700; color: var(--text3); text-transform: uppercase; letter-spacing: 0.05em; }
  input[type=text], input[type=email], input[type=tel], input[type=date], input[type=number], select, textarea {
    background: var(--surface2); border: 1px solid var(--border); border-radius: 8px;
    padding: 9px 12px; color: var(--text); font-size: 13px; outline: none; transition: border-color 0.15s; width: 100%;
  }
  input:focus, select:focus, textarea:focus { border-color: var(--accent); }
  textarea { resize: vertical; min-height: 80px; }

  /* Lead Detail */
  .detail-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; }
  .detail-name { font-size: 22px; font-weight: 700; }
  .detail-phone { font-size: 14px; color: var(--text2); font-family: var(--mono); margin-top: 4px; }
  .detail-tabs { display: flex; gap: 4px; border-bottom: 1px solid var(--border); margin-bottom: 20px; }
  .tab { padding: 8px 16px; font-size: 12px; font-weight: 600; cursor: pointer; border-bottom: 2px solid transparent; color: var(--text3); transition: all 0.15s; }
  .tab.active { color: var(--accent); border-bottom-color: var(--accent); }
  .timeline-item { display: flex; gap: 12px; margin-bottom: 14px; }
  .timeline-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); margin-top: 5px; flex-shrink: 0; }
  .timeline-content { flex: 1; }
  .timeline-text { font-size: 13px; }
  .timeline-date { font-size: 11px; color: var(--text3); font-family: var(--mono); margin-top: 2px; }

  /* Team */
  .team-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
  .team-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 20px; }
  .team-avatar { width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, var(--accent2), var(--accent)); display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 700; color: white; margin-bottom: 12px; }
  .team-name { font-size: 15px; font-weight: 700; }
  .team-email { font-size: 12px; color: var(--text3); margin-top: 2px; margin-bottom: 14px; }
  .team-stats { display: flex; gap: 16px; }
  .team-stat { }
  .team-stat-val { font-size: 18px; font-weight: 700; font-family: var(--mono); }
  .team-stat-lbl { font-size: 10px; color: var(--text3); text-transform: uppercase; letter-spacing: 0.06em; }

  /* Notifications */
  .notif-badge { background: var(--red); color: white; border-radius: 50%; width: 16px; height: 16px; font-size: 9px; font-weight: 700; display: flex; align-items: center; justify-content: center; margin-left: -6px; margin-top: -6px; }

  /* Bar chart */
  .bar-chart { display: flex; align-items: flex-end; gap: 8px; height: 100px; }
  .bar-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; }
  .bar { width: 100%; border-radius: 4px 4px 0 0; transition: height 0.5s ease; }
  .bar-lbl { font-size: 10px; color: var(--text3); text-align: center; }
  .bar-val { font-size: 10px; font-family: var(--mono); color: var(--text2); }

  .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px; color: var(--text3); gap: 12px; }
  .empty-state svg { opacity: 0.3; }
  .empty-state p { font-size: 13px; }

  .tag { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }
  .tag-blue { background: rgba(0,212,255,0.1); color: var(--accent); }
  .tag-green { background: rgba(16,185,129,0.1); color: var(--green); }
  .tag-red { background: rgba(239,68,68,0.1); color: var(--red); }
  .tag-yellow { background: rgba(245,158,11,0.1); color: var(--yellow); }
  .tag-purple { background: rgba(124,58,237,0.1); color: var(--purple); }
  .tag-gray { background: rgba(148,163,184,0.1); color: var(--text2); }

  .divider { height: 1px; background: var(--border); margin: 16px 0; }
  .flex { display: flex; }
  .items-center { align-items: center; }
  .gap-2 { gap: 8px; }
  .gap-3 { gap: 12px; }
  .ml-auto { margin-left: auto; }
  .text-sm { font-size: 12px; }
  .text-xs { font-size: 11px; }
  .text-muted { color: var(--text3); }
  .font-mono { font-family: var(--mono); }
  .mt-2 { margin-top: 8px; }
  .mb-3 { margin-bottom: 12px; }
  .w-full { width: 100%; }

  @media (max-width: 768px) {
    .stat-grid { grid-template-columns: 1fr 1fr; }
    .grid-2 { grid-template-columns: 1fr; }
    .sidebar { width: 60px; min-width: 60px; }
    .sidebar-logo, .nav-item span, .user-name, .user-role, .logo-sub { display: none; }
    .nav-item { justify-content: center; padding: 10px; }
    .user-badge { justify-content: center; padding: 6px; }
  }
`;

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [leads, setLeads] = useState(SAMPLE_LEADS);
  const [users, setUsers] = useState(SAMPLE_USERS);
  const [modal, setModal] = useState(null); // null | "addLead" | "leadDetail" | "addUser"
  const [selectedLead, setSelectedLead] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState("All");
  const [filterSource, setFilterSource] = useState("All");
  const [detailTab, setDetailTab] = useState("timeline");

  const openLead = (lead) => { setSelectedLead(lead); setModal("leadDetail"); setDetailTab("timeline"); };
  const openWA = (phone, e) => { e.stopPropagation(); window.open(`https://wa.me/91${phone}`, "_blank"); };

  const filteredLeads = leads.filter(l => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.phone.includes(search);
    const matchStage = filterStage === "All" || l.stage === filterStage;
    const matchSource = filterSource === "All" || l.source === filterSource;
    return matchSearch && matchStage && matchSource;
  });

  const stats = {
    total: leads.length,
    today: leads.filter(l => l.createdAt === "2024-01-15").length,
    converted: leads.filter(l => l.stage === "Converted").length,
    pipeline: leads.filter(l => !["Converted","Lost"].includes(l.stage)).reduce((a,b) => a + b.value, 0),
    followUps: leads.filter(l => l.followUp).length,
  };

  return (
    <>
      <style>{css}</style>
      <div className="app">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-text">FreeLeadMgmt</div>
            <div className="logo-sub">v1.0 · CRM Platform</div>
          </div>
          <nav className="sidebar-nav">
            {[
              { key:"dashboard", label:"Dashboard", icon:Icons.dashboard },
              { key:"leads", label:"All Leads", icon:Icons.leads },
              { key:"pipeline", label:"Pipeline", icon:Icons.pipeline },
              { key:"team", label:"Team", icon:Icons.team },
            ].map(n => (
              <div key={n.key} className={`nav-item ${page===n.key?"active":""}`} onClick={() => setPage(n.key)}>
                <Icon d={n.icon} size={16}/><span>{n.label}</span>
              </div>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="user-badge">
              <div className="avatar">A</div>
              <div><div className="user-name">Admin</div><div className="user-role">Super Admin</div></div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="main">
          <header className="topbar">
            <div className="page-title">
              {page === "dashboard" && "Dashboard"}
              {page === "leads" && "All Leads"}
              {page === "pipeline" && "Pipeline Board"}
              {page === "team" && "Team Management"}
            </div>
            <div className="topbar-right">
              <div style={{position:"relative",cursor:"pointer"}}>
                <Icon d={Icons.bell} size={18} color="var(--text2)"/>
                <div className="notif-badge">{stats.followUps}</div>
              </div>
              <button className="btn btn-primary" onClick={() => setModal("addLead")}>
                <Icon d={Icons.plus} size={14}/>Add Lead
              </button>
            </div>
          </header>

          <div className="content">
            {page === "dashboard" && <Dashboard stats={stats} leads={leads} openLead={openLead} openWA={openWA}/>}
            {page === "leads" && <LeadsPage leads={filteredLeads} search={search} setSearch={setSearch} filterStage={filterStage} setFilterStage={setFilterStage} filterSource={filterSource} setFilterSource={setFilterSource} openLead={openLead} openWA={openWA} setLeads={setLeads} allLeads={leads}/>}
            {page === "pipeline" && <PipelinePage leads={leads} setLeads={setLeads} openLead={openLead} openWA={openWA}/>}
            {page === "team" && <TeamPage users={users} leads={leads} setModal={setModal} setUsers={setUsers}/>}
          </div>
        </div>
      </div>

      {/* Modals */}
      {modal === "addLead" && <AddLeadModal leads={leads} setLeads={setLeads} close={() => setModal(null)} users={users}/>}
      {modal === "leadDetail" && selectedLead && <LeadDetailModal lead={leads.find(l=>l.id===selectedLead.id)||selectedLead} leads={leads} setLeads={setLeads} close={() => { setModal(null); setSelectedLead(null); }} detailTab={detailTab} setDetailTab={setDetailTab} users={users} openWA={openWA}/>}
      {modal === "addUser" && <AddUserModal users={users} setUsers={setUsers} close={() => setModal(null)}/>}
    </>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ stats, leads, openLead, openWA }) {
  const stageData = STAGES.map(s => ({ stage: s, count: leads.filter(l=>l.stage===s).length }));
  const maxCount = Math.max(...stageData.map(s=>s.count), 1);
  const recent = [...leads].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0,5);

  return (
    <>
      <div className="stat-grid">
        <div className="stat-card c1">
          <div className="stat-label">Total Leads</div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-sub">All time</div>
        </div>
        <div className="stat-card c2">
          <div className="stat-label">Converted</div>
          <div className="stat-value" style={{color:"var(--green)"}}>{stats.converted}</div>
          <div className="stat-sub">{Math.round(stats.converted/stats.total*100)}% conversion rate</div>
        </div>
        <div className="stat-card c3">
          <div className="stat-label">Pipeline Value</div>
          <div className="stat-value" style={{color:"var(--yellow)"}}>₹{(stats.pipeline/1000).toFixed(0)}K</div>
          <div className="stat-sub">Active opportunities</div>
        </div>
        <div className="stat-card c4">
          <div className="stat-label">Follow-ups Due</div>
          <div className="stat-value" style={{color:"var(--purple)"}}>{stats.followUps}</div>
          <div className="stat-sub">Scheduled reminders</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">Pipeline Overview</div>
          <div className="bar-chart">
            {stageData.filter(s=>!["Not Interested","Lost"].includes(s.stage)).map(s => (
              <div key={s.stage} className="bar-wrap">
                <div className="bar-val">{s.count}</div>
                <div className="bar" style={{height:`${(s.count/maxCount)*80}px`, minHeight:"4px", background:STAGE_COLORS[s.stage]+"99"}}/>
                <div className="bar-lbl">{s.stage.split(" ")[0]}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-title">Source Breakdown</div>
          {Object.entries(leads.reduce((acc,l) => { acc[l.source]=(acc[l.source]||0)+1; return acc; }, {})).map(([src,cnt]) => (
            <div key={src} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
              <div style={{flex:1,fontSize:12}}>{src}</div>
              <div style={{flex:2,height:8,background:"var(--surface2)",borderRadius:4,overflow:"hidden"}}>
                <div style={{width:`${(cnt/leads.length)*100}%`,height:"100%",background:"var(--accent)",borderRadius:4,opacity:0.7}}/>
              </div>
              <div style={{fontSize:11,color:"var(--text3)",fontFamily:"var(--mono)",width:20,textAlign:"right"}}>{cnt}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{marginTop:16}}>
        <div className="card">
          <div className="card-title">Recent Leads</div>
          <table><thead><tr>
            <th>Name</th><th>Phone</th><th>Source</th><th>Stage</th><th>Value</th><th>Action</th>
          </tr></thead><tbody>
            {recent.map(l => (
              <tr key={l.id} onClick={()=>openLead(l)} style={{cursor:"pointer"}}>
                <td style={{fontWeight:600}}>{l.name}</td>
                <td className="font-mono text-sm text-muted">{l.phone}</td>
                <td><span className="tag tag-blue">{l.source}</span></td>
                <td><StageBadge stage={l.stage}/></td>
                <td className="font-mono text-sm" style={{color:"var(--green)"}}>₹{l.value.toLocaleString()}</td>
                <td><div className="wa-btn" onClick={(e)=>openWA(l.phone,e)}><Icon d={Icons.whatsapp} size={13}/></div></td>
              </tr>
            ))}
          </tbody></table>
        </div>
      </div>
    </>
  );
}

// ─── Leads Page ───────────────────────────────────────────────────────────────
function LeadsPage({ leads, search, setSearch, filterStage, setFilterStage, filterSource, setFilterSource, openLead, openWA, setLeads, allLeads }) {
  const deleteLead = (id, e) => { e.stopPropagation(); if(window.confirm("Move to trash?")) setLeads(prev => prev.filter(l=>l.id!==id)); };
  return (
    <>
      <div className="search-bar">
        <div className="search-wrap">
          <span className="search-icon"><Icon d={Icons.search} size={14}/></span>
          <input className="search-input" placeholder="Search by name or phone..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <select className="filter-sel" value={filterStage} onChange={e=>setFilterStage(e.target.value)}>
          <option>All</option>{STAGES.map(s=><option key={s}>{s}</option>)}
        </select>
        <select className="filter-sel" value={filterSource} onChange={e=>setFilterSource(e.target.value)}>
          <option>All</option>{SOURCES.map(s=><option key={s}>{s}</option>)}
        </select>
        <span className="text-muted text-xs">{leads.length} leads</span>
      </div>
      <div className="card" style={{padding:0}}>
        <table><thead><tr>
          <th>Name</th><th>Phone</th><th>Source</th><th>Campaign</th><th>Stage</th><th>Assigned</th><th>Value</th><th>Follow-up</th><th>Actions</th>
        </tr></thead><tbody>
          {leads.length === 0 && <tr><td colSpan={9}><div className="empty-state"><Icon d={Icons.leads} size={40}/><p>No leads found</p></div></td></tr>}
          {leads.map(l => (
            <tr key={l.id} onClick={()=>openLead(l)} style={{cursor:"pointer"}}>
              <td style={{fontWeight:600}}>{l.name}</td>
              <td className="font-mono text-sm text-muted">{l.phone}</td>
              <td><span className="tag tag-blue text-xs">{l.source}</span></td>
              <td className="text-muted text-sm">{l.campaign||"—"}</td>
              <td><StageBadge stage={l.stage}/></td>
              <td className="text-sm">{l.assignedTo||"—"}</td>
              <td className="font-mono text-sm" style={{color:"var(--green)"}}>₹{l.value.toLocaleString()}</td>
              <td className="font-mono text-xs text-muted">{l.followUp||"—"}</td>
              <td onClick={e=>e.stopPropagation()}>
                <div style={{display:"flex",gap:6}}>
                  <div className="wa-btn" onClick={(e)=>openWA(l.phone,e)}><Icon d={Icons.whatsapp} size={13}/></div>
                  <button className="btn btn-sm btn-ghost" onClick={()=>openLead(l)}><Icon d={Icons.edit} size={12}/></button>
                  <button className="btn btn-sm btn-danger" onClick={(e)=>deleteLead(l.id,e)}><Icon d={Icons.trash} size={12}/></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody></table>
      </div>
    </>
  );
}

// ─── Pipeline ─────────────────────────────────────────────────────────────────
function PipelinePage({ leads, setLeads, openLead, openWA }) {
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);

  const onDragStart = (e, lead) => { setDragging(lead); e.dataTransfer.effectAllowed = "move"; };
  const onDragOver = (e, stage) => { e.preventDefault(); setDragOver(stage); };
  const onDrop = (e, stage) => {
    e.preventDefault();
    if (dragging && dragging.stage !== stage) {
      setLeads(prev => prev.map(l => l.id === dragging.id ? {...l, stage} : l));
    }
    setDragging(null); setDragOver(null);
  };

  return (
    <div className="pipeline-scroll">
      {STAGES.map(stage => {
        const stageLeads = leads.filter(l => l.stage === stage);
        const isOver = dragOver === stage;
        return (
          <div key={stage} className="pipeline-col"
            style={{borderColor: isOver ? STAGE_COLORS[stage] : undefined}}
            onDragOver={e=>onDragOver(e,stage)} onDrop={e=>onDrop(e,stage)} onDragLeave={()=>setDragOver(null)}>
            <div className="col-header">
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div className="col-dot" style={{background:STAGE_COLORS[stage]}}/>
                <span className="col-title">{stage}</span>
              </div>
              <span className="col-count">{stageLeads.length}</span>
            </div>
            <div className="col-body">
              {stageLeads.map(lead => (
                <div key={lead.id} className="lead-card" draggable
                  onDragStart={e=>onDragStart(e,lead)} onClick={()=>openLead(lead)}>
                  <div className="lead-name">{lead.name}</div>
                  <div className="lead-phone">{lead.phone}</div>
                  <div className="lead-meta">
                    <span className="value-tag">₹{(lead.value/1000).toFixed(0)}K</span>
                    <div className="wa-btn" onClick={e=>openWA(lead.phone,e)}><Icon d={Icons.whatsapp} size={12}/></div>
                  </div>
                  {lead.followUp && <div style={{fontSize:10,color:"var(--yellow)",marginTop:6}}>📅 {lead.followUp}</div>}
                </div>
              ))}
              {stageLeads.length === 0 && <div style={{textAlign:"center",color:"var(--text3)",fontSize:11,padding:"20px 0"}}>Drop leads here</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Team Page ────────────────────────────────────────────────────────────────
function TeamPage({ users, leads, setModal, setUsers }) {
  return (
    <>
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:16}}>
        <button className="btn btn-primary" onClick={()=>setModal("addUser")}><Icon d={Icons.plus} size={14}/>Add Team Member</button>
      </div>
      <div className="team-grid">
        {users.map(u => (
          <div key={u.id} className="team-card">
            <div className="team-avatar">{u.name[0]}</div>
            <div className="team-name">{u.name}</div>
            <div className="team-email">{u.email}</div>
            <div style={{marginBottom:12}}><span className="tag tag-purple">{u.role}</span></div>
            <div className="team-stats">
              <div className="team-stat">
                <div className="team-stat-val">{leads.filter(l=>l.assignedTo===u.name.split(" ")[0]).length}</div>
                <div className="team-stat-lbl">Leads</div>
              </div>
              <div className="team-stat">
                <div className="team-stat-val" style={{color:"var(--green)"}}>{leads.filter(l=>l.assignedTo===u.name.split(" ")[0]&&l.stage==="Converted").length}</div>
                <div className="team-stat-lbl">Converted</div>
              </div>
              <div className="team-stat">
                <div className="team-stat-val" style={{color:"var(--yellow)"}}>{leads.filter(l=>l.assignedTo===u.name.split(" ")[0]&&l.followUp).length}</div>
                <div className="team-stat-lbl">Follow-ups</div>
              </div>
            </div>
            <div className="divider"/>
            <button className="btn btn-ghost btn-sm w-full" onClick={()=>{if(window.confirm("Remove team member?")) setUsers(prev=>prev.filter(x=>x.id!==u.id));}}>Remove</button>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── Lead Detail Modal ────────────────────────────────────────────────────────
function LeadDetailModal({ lead, leads, setLeads, close, detailTab, setDetailTab, users, openWA }) {
  const [note, setNote] = useState("");
  const [callNote, setCallNote] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ ...lead });

  const update = (field, val) => setForm(f=>({...f,[field]:val}));
  const saveEdit = () => {
    setLeads(prev => prev.map(l => l.id===lead.id ? {...l,...form} : l));
    setEditMode(false);
  };
  const addNote = () => {
    if (!note.trim()) return;
    const updated = { ...lead, notes: [...lead.notes, { text: note, date: new Date().toISOString().split("T")[0] }] };
    setLeads(prev => prev.map(l => l.id===lead.id ? updated : l));
    setNote("");
  };
  const addCall = () => {
    const updated = { ...lead, calls: [...lead.calls, { type:"Outgoing", duration:"5 min", outcome:callNote||"Discussed", date: new Date().toISOString().split("T")[0] }] };
    setLeads(prev => prev.map(l => l.id===lead.id ? updated : l));
    setCallNote("");
  };

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal" style={{maxWidth:680}} onClick={e=>e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">{lead.name}</div>
            <div style={{fontSize:12,color:"var(--text3)",fontFamily:"var(--mono)",marginTop:2}}>{lead.phone} · {lead.email}</div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button className="btn btn-success btn-sm" onClick={e=>openWA(lead.phone,e)}><Icon d={Icons.whatsapp} size={13}/>WhatsApp</button>
            <button className="btn btn-ghost btn-sm" onClick={()=>setEditMode(!editMode)}><Icon d={Icons.edit} size={13}/>{editMode?"Cancel":"Edit"}</button>
            <button className="btn btn-ghost btn-sm" onClick={close}><Icon d={Icons.close} size={14}/></button>
          </div>
        </div>
        <div className="modal-body">
          {editMode ? (
            <>
              <div className="form-row">
                <div className="form-group"><label>Name</label><input type="text" value={form.name} onChange={e=>update("name",e.target.value)}/></div>
                <div className="form-group"><label>Phone</label><input type="tel" value={form.phone} onChange={e=>update("phone",e.target.value)}/></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={e=>update("email",e.target.value)}/></div>
                <div className="form-group"><label>Value (₹)</label><input type="number" value={form.value} onChange={e=>update("value",Number(e.target.value))}/></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Stage</label><select value={form.stage} onChange={e=>update("stage",e.target.value)}>{STAGES.map(s=><option key={s}>{s}</option>)}</select></div>
                <div className="form-group"><label>Assigned To</label><select value={form.assignedTo} onChange={e=>update("assignedTo",e.target.value)}><option value="">Unassigned</option>{users.map(u=><option key={u.id}>{u.name.split(" ")[0]}</option>)}</select></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Source</label><select value={form.source} onChange={e=>update("source",e.target.value)}>{SOURCES.map(s=><option key={s}>{s}</option>)}</select></div>
                <div className="form-group"><label>Follow-up Date</label><input type="date" value={form.followUp||""} onChange={e=>update("followUp",e.target.value)}/></div>
              </div>
              <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
                <button className="btn btn-primary" onClick={saveEdit}>Save Changes</button>
              </div>
            </>
          ) : (
            <>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}}>
                <div style={{background:"var(--surface2)",borderRadius:8,padding:12}}>
                  <div style={{fontSize:10,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>Stage</div>
                  <StageBadge stage={lead.stage}/>
                </div>
                <div style={{background:"var(--surface2)",borderRadius:8,padding:12}}>
                  <div style={{fontSize:10,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>Value</div>
                  <div style={{fontSize:16,fontWeight:700,color:"var(--green)",fontFamily:"var(--mono)"}}>₹{lead.value.toLocaleString()}</div>
                </div>
                <div style={{background:"var(--surface2)",borderRadius:8,padding:12}}>
                  <div style={{fontSize:10,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>Follow-up</div>
                  <div style={{fontSize:13,fontWeight:600,color:"var(--yellow)"}}>{lead.followUp||"Not set"}</div>
                </div>
              </div>
              <div style={{display:"flex",gap:12,marginBottom:16,flexWrap:"wrap"}}>
                <span className="tag tag-blue">{lead.source}</span>
                {lead.campaign && <span className="tag tag-gray">{lead.campaign}</span>}
                <span className="tag tag-purple">Assigned: {lead.assignedTo||"None"}</span>
              </div>
            </>
          )}

          <div className="detail-tabs">
            {["timeline","notes","calls","followup"].map(t=>(
              <div key={t} className={`tab ${detailTab===t?"active":""}`} onClick={()=>setDetailTab(t)}>
                {t.charAt(0).toUpperCase()+t.slice(1)}
              </div>
            ))}
          </div>

          {detailTab === "timeline" && (
            <div>
              <div className="timeline-item"><div className="timeline-dot"/><div className="timeline-content"><div className="timeline-text">Lead created from <strong>{lead.source}</strong></div><div className="timeline-date">{lead.createdAt}</div></div></div>
              {lead.notes.map((n,i)=><div key={i} className="timeline-item"><div className="timeline-dot" style={{background:"var(--yellow)"}}/><div className="timeline-content"><div className="timeline-text">Note added: {n.text}</div><div className="timeline-date">{n.date}</div></div></div>)}
              {lead.calls.map((c,i)=><div key={i} className="timeline-item"><div className="timeline-dot" style={{background:"var(--green)"}}/><div className="timeline-content"><div className="timeline-text">{c.type} call · {c.duration} · {c.outcome}</div><div className="timeline-date">{c.date}</div></div></div>)}
              {lead.followUp && <div className="timeline-item"><div className="timeline-dot" style={{background:"var(--purple)"}}/><div className="timeline-content"><div className="timeline-text">Follow-up scheduled</div><div className="timeline-date">{lead.followUp}</div></div></div>}
            </div>
          )}

          {detailTab === "notes" && (
            <div>
              {lead.notes.map((n,i)=><div key={i} style={{background:"var(--surface2)",borderRadius:8,padding:12,marginBottom:10}}><div style={{fontSize:13}}>{n.text}</div><div style={{fontSize:11,color:"var(--text3)",marginTop:4}}>{n.date}</div></div>)}
              {lead.notes.length===0 && <p style={{color:"var(--text3)",fontSize:13,marginBottom:14}}>No notes yet.</p>}
              <div style={{display:"flex",gap:8,marginTop:12}}>
                <input type="text" value={note} onChange={e=>setNote(e.target.value)} placeholder="Add a note..." style={{flex:1}} onKeyDown={e=>e.key==="Enter"&&addNote()}/>
                <button className="btn btn-primary" onClick={addNote}><Icon d={Icons.plus} size={14}/>Add</button>
              </div>
            </div>
          )}

          {detailTab === "calls" && (
            <div>
              {lead.calls.map((c,i)=><div key={i} style={{background:"var(--surface2)",borderRadius:8,padding:12,marginBottom:10,display:"flex",gap:12,alignItems:"center"}}><Icon d={Icons.phone} size={16} color="var(--green)"/><div><div style={{fontSize:13,fontWeight:600}}>{c.type} · {c.duration}</div><div style={{fontSize:12,color:"var(--text3)"}}>{c.outcome} · {c.date}</div></div></div>)}
              {lead.calls.length===0 && <p style={{color:"var(--text3)",fontSize:13,marginBottom:14}}>No calls logged yet.</p>}
              <div style={{display:"flex",gap:8,marginTop:12}}>
                <input type="text" value={callNote} onChange={e=>setCallNote(e.target.value)} placeholder="Call outcome / notes..." style={{flex:1}}/>
                <button className="btn btn-primary" onClick={addCall}><Icon d={Icons.phone} size={14}/>Log Call</button>
              </div>
            </div>
          )}

          {detailTab === "followup" && (
            <div>
              <div className="form-group">
                <label>Schedule Follow-up</label>
                <input type="date" value={form.followUp||""} onChange={e=>{
                  update("followUp",e.target.value);
                  setLeads(prev=>prev.map(l=>l.id===lead.id?{...l,followUp:e.target.value}:l));
                }}/>
              </div>
              <p style={{fontSize:12,color:"var(--text3)"}}>Current: {lead.followUp||"Not scheduled"}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Add Lead Modal ───────────────────────────────────────────────────────────
function AddLeadModal({ leads, setLeads, close, users }) {
  const [form, setForm] = useState({ name:"", phone:"", email:"", source:"Meta Lead Ads", campaign:"", stage:"New Lead", assignedTo:"", value:0, followUp:"" });
  const set = (f,v) => setForm(p=>({...p,[f]:v}));
  const save = () => {
    if (!form.name || !form.phone) return alert("Name and phone are required");
    setLeads(prev => [...prev, { ...form, id: Date.now(), createdAt: new Date().toISOString().split("T")[0], notes:[], calls:[], value: Number(form.value) }]);
    close();
  };
  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-header"><div className="modal-title">Add New Lead</div><button className="btn btn-ghost btn-sm" onClick={close}><Icon d={Icons.close} size={14}/></button></div>
        <div className="modal-body">
          <div className="form-row">
            <div className="form-group"><label>Full Name *</label><input type="text" placeholder="Priya Sharma" value={form.name} onChange={e=>set("name",e.target.value)}/></div>
            <div className="form-group"><label>Phone *</label><input type="tel" placeholder="9876543210" value={form.phone} onChange={e=>set("phone",e.target.value)}/></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Email</label><input type="email" placeholder="priya@email.com" value={form.email} onChange={e=>set("email",e.target.value)}/></div>
            <div className="form-group"><label>Value (₹)</label><input type="number" placeholder="25000" value={form.value} onChange={e=>set("value",e.target.value)}/></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Source</label><select value={form.source} onChange={e=>set("source",e.target.value)}>{SOURCES.map(s=><option key={s}>{s}</option>)}</select></div>
            <div className="form-group"><label>Campaign</label><input type="text" placeholder="Summer Sale" value={form.campaign} onChange={e=>set("campaign",e.target.value)}/></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Initial Stage</label><select value={form.stage} onChange={e=>set("stage",e.target.value)}>{STAGES.map(s=><option key={s}>{s}</option>)}</select></div>
            <div className="form-group"><label>Assign To</label><select value={form.assignedTo} onChange={e=>set("assignedTo",e.target.value)}><option value="">Unassigned</option>{users.map(u=><option key={u.id}>{u.name.split(" ")[0]}</option>)}</select></div>
          </div>
          <div className="form-group"><label>Follow-up Date</label><input type="date" value={form.followUp} onChange={e=>set("followUp",e.target.value)}/></div>
        </div>
        <div className="modal-footer"><button className="btn btn-ghost" onClick={close}>Cancel</button><button className="btn btn-primary" onClick={save}><Icon d={Icons.plus} size={14}/>Add Lead</button></div>
      </div>
    </div>
  );
}

// ─── Add User Modal ───────────────────────────────────────────────────────────
function AddUserModal({ users, setUsers, close }) {
  const [form, setForm] = useState({ name:"", email:"", role:"Sales" });
  const save = () => {
    if (!form.name || !form.email) return alert("Name and email are required");
    setUsers(prev => [...prev, { ...form, id: Date.now(), leads:0, converted:0 }]);
    close();
  };
  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal" style={{maxWidth:420}} onClick={e=>e.stopPropagation()}>
        <div className="modal-header"><div className="modal-title">Add Team Member</div><button className="btn btn-ghost btn-sm" onClick={close}><Icon d={Icons.close} size={14}/></button></div>
        <div className="modal-body">
          <div className="form-group"><label>Full Name *</label><input type="text" placeholder="Rahul Kumar" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></div>
          <div className="form-group"><label>Email *</label><input type="email" placeholder="rahul@company.com" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/></div>
          <div className="form-group"><label>Role</label><select value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))}><option>Sales</option><option>Manager</option><option>Business Admin</option></select></div>
        </div>
        <div className="modal-footer"><button className="btn btn-ghost" onClick={close}>Cancel</button><button className="btn btn-primary" onClick={save}><Icon d={Icons.plus} size={14}/>Add Member</button></div>
      </div>
    </div>
  );
}

// ─── Stage Badge ──────────────────────────────────────────────────────────────
function StageBadge({ stage }) {
  const color = STAGE_COLORS[stage] || "#94a3b8";
  return <span className="stage-badge" style={{background:color+"18",color}}>{stage}</span>;
}
