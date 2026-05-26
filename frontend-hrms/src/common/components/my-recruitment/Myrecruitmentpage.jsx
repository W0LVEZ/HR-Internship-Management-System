import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import {
  Search, SlidersHorizontal, User, FileText,
  Briefcase, X, Eye,
  ChevronLeft, ChevronRight, Mail, ClipboardList
} from "lucide-react";
import MyPartnerUnivirsity from "./MyPartnerUnivirsity";
import { addSystemLog, LOG_TYPES } from "../../utils/systemLogger";

const getRecruitmentApps = () => {
  const db = JSON.parse(localStorage.getItem("hrims_users_db") || "{}");

  return Object.values(db).filter(u => u.role === "INTERN").map(u => ({
    ...u, prog: u.course || "Program", uni: u.university || "University",
    date: u.duration?.split(" - ")[0] || "Date", hrs: u.hours || "200 hrs",
    year: u.year || "4th Year", dept: u.department || "Department",
    status: "Pending",
  }));
};

export default function Myrecruitmentpage() {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === "ADMIN";

  const [tab, setTab] = useState("Application");
  const [sideTab, setSideTab] = useState("Information");
  const [selId, setSelId] = useState(null);
  const [search, setSearch] = useState("");
  const [f, setF] = useState({ 
    open: false, progs: [], stats: [], tProgs: [], tStats: [] 
  });
  const [apps, setApps] = useState(() => getRecruitmentApps());

  const progs = [...new Set(apps.map(a => a.prog))];
  const stats = ["Pending", "Approved", "Rejected", "Deploy"];
  const unis = [...new Set(apps.map(a => a.uni))].map((name, id) => {
    const uniInterns = apps.filter(a => a.uni === name);
    return {
      id,
      name,
      status: "Active Partner",
      branch: "Branch/Campus",
      contactPerson: "Name",
      address: "Address",
      phone: "Number",
      email: "email@gmail.com",
      internCount: uniInterns.length,
    };
  });
  const selApp = apps.find(a => a.id === selId);

  const filtered = apps.filter(a => {
    const sMatch = (a.name || "").toLowerCase().includes(search.toLowerCase());
    const tMatch = tab === "For Admin Approval"
      ? ["Approved", "Deploy"].includes(a.status)
      : ["Pending", "Approved", "Rejected"].includes(a.status);
    return sMatch && (!f.progs.length || f.progs.includes(a.prog)) &&
           (!f.stats.length || f.stats.includes(a.status)) && tMatch;
  });
  const selectedIndex = filtered.findIndex(a => a.id === selId);

  const toggle = (l, v) => setF(p => ({
    ...p, [l]: p[l].includes(v) ? p[l].filter(i => i !== v) : [...p[l], v]
  }));
  
  const setStat = s => {
    if (!selId) return;

    const selectedApp = apps.find(a => a.id === selId);
    const usersDb = JSON.parse(localStorage.getItem("hrims_users_db") || "{}");
    const supervisor = usersDb[selectedApp?.supervisorId];

    if (s === "Deploy" && selectedApp && selectedApp.status !== "Deploy") {
      addSystemLog({
        action: LOG_TYPES.INTERN_EMPLOYED,
        title: "New Intern Employed",
        description: `${selectedApp.name} has been deployed as an employed intern.`,
        actorId: currentUser?.id,
        actorName: currentUser?.name,
        actorRole: currentUser?.role,
        audience: ["hr-admin", "hr-staff"],
        supervisorId: selectedApp.supervisorId,
        internId: selectedApp.id,
        metadata: {
          department: selectedApp.department,
          university: selectedApp.university,
        },
      });

      if (selectedApp.supervisorId) {
        addSystemLog({
          action: LOG_TYPES.INTERN_ASSIGNED_SUPERVISOR,
          title: "Intern Assigned to Supervisor",
          description: `${selectedApp.name} was assigned to ${supervisor?.name || "a supervisor"}.`,
          actorId: currentUser?.id,
          actorName: currentUser?.name,
          actorRole: currentUser?.role,
          audience: ["hr-admin", "hr-staff", "supervisor", "intern"],
          supervisorId: selectedApp.supervisorId,
          internId: selectedApp.id,
          metadata: {
            department: selectedApp.department,
            supervisorName: supervisor?.name,
          },
        });
      }
    }

    setApps(c => c.map(a => a.id === selId ? { ...a, status: s } : a));
  };

  const moveSelection = dir => {
    if (!filtered.length) return;
    const fallback = dir > 0 ? 0 : filtered.length - 1;
    const nextIndex = selectedIndex === -1
      ? fallback
      : (selectedIndex + dir + filtered.length) % filtered.length;
    setSelId(filtered[nextIndex].id);
    setSideTab("Information");
  };

  const getBadge = s => {
    const c = { Pending: "bg-[#FFF9E5] text-[#D97706]", 
                Approved: "bg-green-100 text-green-700",
                Rejected: "bg-red-100 text-red-700", 
                Deploy: "bg-gray-800 text-white" };
    return `px-2.5 py-1 rounded text-xs font-semibold ${c[s] || "bg-gray-200"}`;
  };

  const btn = "flex-1 py-2.5 rounded-lg text-sm font-bold transition-colors";
  const td = "px-3 py-4 border-b border-gray-50 text-sm text-gray-600 truncate";
  const lbl = "text-[11px] uppercase tracking-wider font-semibold text-gray-400 mb-1";
  const selCls = "w-full text-sm font-semibold outline-none border-b " + 
                 "border-gray-200 pb-1.5 cursor-pointer";
  const detailLbl = "text-[11px] font-medium text-gray-400 mb-1";
  const detailValue = "text-[13px] font-medium text-gray-800 truncate";
  const sidebarTabs = [
    { id: "Information", icon: <User size={16} /> },
    { id: "Documents", icon: <ClipboardList size={16} /> },
  ];
  const documents = ["Resume.pdf", "Endorsement Letter.pdf", "MOA.pdf"];
  const getInitials = name => (name || "SN")
    .split(" ")
    .map(part => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="p-6 relative">
      <div>
        
        {/* Main Content */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 min-w-0">
          <div className="flex justify-between items-center mb-4">

            <div className="relative w-80">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                            placeholder={tab === "Partner University" ? "Search Universities.." : "Search Applicants..."}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md 
                            text-sm outline-none focus:border-violet-400" />
            </div>
            {tab !== "Partner University" && (
              <button onClick={() => setF(p => ({ ...p, open: true, tProgs: p.progs, tStats: p.stats }))}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 
                           rounded-md text-sm text-gray-700 hover:bg-gray-50">
                <SlidersHorizontal size={16} /> Filter
              </button>
            )}
          </div>

          {/* Filter Dropdown */}
          {f.open && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setF(p => ({ ...p, open: false }))} />
              <div className="absolute right-12 top-24 z-50 w-[340px] bg-white border 
                              border-gray-100 shadow-xl rounded-xl p-6">
                <div className="flex justify-between mb-5">
                  <h3 className="font-semibold text-gray-900">Filter</h3>
                  <X size={18} className="cursor-pointer text-gray-400" 
                     onClick={() => setF(p => ({ ...p, open: false }))} />
                </div>
                {[{ t: "Program", k: "tProgs", l: progs }, { t: "Status", k: "tStats", l: stats }].map(g => (
                  <div key={g.t} className="mb-6">
                    <p className={lbl}>{g.t}</p>

                    <div className={g.k === "tProgs" ? "space-y-3 max-h-48 overflow-y-auto" : "grid grid-cols-2 gap-3"}>
                      {g.l.map(i => (
                        <label key={i} className="flex gap-3 text-sm text-gray-600 cursor-pointer items-center">
                          <input type="checkbox" checked={f[g.k].includes(i)} onChange={() => toggle(g.k, i)} 
                                 className="w-4 h-4 rounded accent-violet-600 cursor-pointer" /> {i}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="flex gap-3">
                  <button onClick={() => setF(p => ({ ...p, tProgs: [], tStats: [] }))} 
                          className={`${btn} bg-gray-100 hover:bg-gray-200 text-gray-700`}>Reset</button>
                  <button onClick={() => setF(p => ({ ...p, open: false, progs: p.tProgs, stats: p.tStats }))} 
                          className={`${btn} bg-violet-600 text-white hover:bg-violet-700`}>Apply</button>
                </div>
              </div>
            </>
          )}

          {/* Tabs */}
          <div className="flex border-b border-gray-100 mb-4">
            {[{ id: "Application", i: <User size={16} /> }, 
              { id: "For Admin Approval", i: <FileText size={16} /> }, 
              { id: "Partner University", i: <Briefcase size={16} /> }]
              .filter(t => !isAdmin || t.id !== "For Admin Approval")
              .map(t => (
              <button key={t.id} onClick={() => { setTab(t.id); setSelId(null); setSearch(""); }}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 
                           ${tab === t.id ? "border-violet-600 text-violet-600" : "border-transparent text-gray-500 hover:text-gray-800"}`}>
                {t.i}{t.id}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="mt-4">
            {tab === "Partner University" ? (
              <MyPartnerUnivirsity
                universities={unis}
                interns={apps}
                search={search}
              />
            ) : (
              <div className="flex items-start gap-4 min-h-[520px]">
                <div className="flex-1 min-w-0 overflow-x-auto">
                  <table className="w-full table-fixed border-collapse">
                    <thead>
                      <tr className="text-left text-gray-800 border-b border-gray-100">
                        {[{ l: "Intern Name", w: "18%" }, 
                          { l: "University", w: "28%" }, 
                          { l: "Program", w: "24%" }, 
                          { l: "Date", w: "10%" }, 
                          { l: "Hours", w: "10%" }, 
                          { l: "Status", w: "10%" }
                      ].map(h => (
                          <th key={h.l} className={`px-3 pb-3 font-semibold text-sm w-[${h.w}]`}>{h.l}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length ? filtered.map(r => (
                        <tr key={r.id} onClick={() => setSelId(r.id)} 
                            className={`cursor-pointer transition-colors 
                            ${selId === r.id ? 
                            "bg-violet-50/60" : 
                            "hover:bg-gray-50"}`}
                      >
                          <td className="px-3 py-4 border-b border-gray-50 
                                  text-sm font-medium text-gray-900 
                                  truncate" title={r.name}>{r.name}
                          </td>
                          {['uni', 'prog', 'date', 'hrs'].map(k => 
                          <td key={k} className={td} title={r[k]}>{r[k]}</td>)}

                          <td className="px-3 py-4 border-b border-gray-50">
                              <span className={getBadge(r.status)}>{r.status}</span>
                          </td>

                        </tr>
                      )) : <tr><td colSpan="6" className="text-center py-12 text-gray-500">No applicants found!</td></tr>}
                    </tbody>
                  </table>
                </div>

                {/* Details Right Sidebar */}
                {selApp && (
                  <aside className="bg-white rounded-lg border border-gray-100 w-[350px] shrink-0 p-4 self-stretch">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => moveSelection(-1)}
                className="p-1.5 rounded-md text-gray-700 hover:bg-gray-50"
                aria-label="Previous applicant"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => moveSelection(1)}
                className="p-1.5 rounded-md text-gray-700 hover:bg-gray-50"
                aria-label="Next applicant"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="flex gap-4 pb-4">
              <div className="w-[84px] h-[84px] rounded-lg bg-violet-100 text-violet-600 shrink-0 flex items-center justify-center text-xl font-bold overflow-hidden">
                {getInitials(selApp.name)}
              </div>

              <div className="min-w-0 pt-1">
                <h2 className="text-xl font-bold leading-tight text-gray-950 truncate" title={selApp.name}>
                  {selApp.name}
                </h2>
                <div className="flex items-center gap-1.5 mt-2 text-[13px] text-gray-600 min-w-0">
                  <Mail size={15} className="shrink-0" />
                  <span className="truncate" title={selApp.email}>{selApp.email}</span>
                </div>
                <div className="mt-2">
                  <span className={getBadge(selApp.status)}>{selApp.status}</span>
                </div>
              </div>
            </div>

            <div className="flex border-b border-gray-100">
              {sidebarTabs.map(({ id, icon }) => (
                <button
                  key={id}
                  onClick={() => setSideTab(id)}
                  className={`flex items-center justify-center gap-2 px-3 pb-2.5 text-[13px] font-bold border-b-2 transition-colors
                    ${sideTab === id
                      ? "border-violet-600 text-violet-600"
                      : "border-transparent text-gray-700 hover:text-violet-600"}`}
                >
                  {icon}
                  {id}
                </button>
              ))}
            </div>

            {sideTab === "Information" ? (
              <div className="divide-y divide-gray-50">
                {[
                  { l: "University", v: selApp.uni },
                  { l: "Program", v: selApp.prog },
                  { l: "Year Level", v: selApp.year },
                  { l: "Required Hours", v: selApp.hrs },
                  { l: "Preferred Department", v: selApp.dept },
                  ...(!isAdmin ? [
                    { l: "Phone", v: selApp.phone || "-" },
                    { l: "Start Date", v: selApp.date },
                  ] : []),
                ].map(d => (
                  <div key={d.l} className="py-3">
                    <p className={detailLbl}>{d.l}</p>
                    <p className={detailValue} title={d.v}>{d.v}</p>
                  </div>
                ))}

                {tab === "For Admin Approval" && (
                  <div className="py-3 space-y-4">
                    <div>
                      <p className={detailLbl}>Department</p>
                      <select className={selCls}>
                        <option>IT</option>
                        <option>HR</option>
                      </select>
                    </div>
                    <div>
                      <p className={detailLbl}>Supervisor</p>
                      <select className={selCls}>
                        <option>Sarah (Supervisor)</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {documents.map(d => (
                  <div key={d} className="flex items-center justify-between py-3">
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-gray-800 truncate">{d}</p>
                      <p className="text-[11px] text-gray-400">Applicant document</p>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-md" aria-label={`View ${d}`}>
                      <Eye size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3 pt-4 mt-2 border-t border-gray-100">
              {tab === "For Admin Approval" ? (
                <>
                  {selApp.status !== "Deploy" && (
                    <button onClick={() => setStat("Deploy")}
                      className={`${btn} bg-violet-600 hover:bg-violet-700 text-white`}>
                      Deploy
                    </button>
                  )}
                  <button onClick={() => (selApp.status === "Deploy" ? setStat("Approved") : setSelId(null))}
                    className={`${btn} bg-gray-100 hover:bg-gray-200 text-gray-700`}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setStat("Approved")}
                    className={`${btn} bg-violet-600 hover:bg-violet-700 text-white`}>
                    Approve
                  </button>
                  <button onClick={() => setStat("Rejected")}
                    className={`${btn} bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600`}>
                    Reject
                  </button>
                </>
              )}
            </div>
                  </aside>
                )}
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
