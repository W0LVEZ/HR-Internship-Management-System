import { useState, useEffect, useMemo } from "react";
import { X, FileSpreadsheet, Printer, TrendingUp, Calendar, Users, Award, Building2 } from "lucide-react";

export default function GenerateReportModal({ onClose }) {
  const [timeframe, setTimeframe] = useState("Past Week");
  const [reportData, setReportData] = useState(null);

  // Generate dynamic mockup data based on the chosen timeframe
  const dataMap = useMemo(() => ({
    "Today": {
      title: "Daily Performance Report",
      subtitle: "Snapshot of Today's Activities",
      metrics: {
        totalInterns: 470,
        activeInterns: 412,
        attendanceRate: "94.2%",
        tasksCompleted: 85,
        newApplications: 4,
      },
      highlights: [
        "85 daily DTR logs submitted and verified.",
        "4 new applications received for the IT Department.",
        "IT department reached 98% attendance rate today.",
        "Supervisor Sarah evaluated 3 interns in IT."
      ],
      departmentBreakdown: [
        { name: "Information Technology", active: 200, attendance: "98%" },
        { name: "Human Resources", active: 110, attendance: "92%" },
        { name: "Marketing", active: 82, attendance: "90%" },
        { name: "Finance", active: 20, attendance: "95%" }
      ]
    },
    "Past Week": {
      title: "Weekly Performance Report",
      subtitle: "Summary of Internship operations this week",
      metrics: {
        totalInterns: 470,
        activeInterns: 428,
        attendanceRate: "91.8%",
        tasksCompleted: 420,
        newApplications: 28,
      },
      highlights: [
        "420 supervisor tasks resolved and checked.",
        "28 new intern applications successfully processed.",
        "Partner university MOA renewed for Technological University of the Philippines.",
        "Weekly DTR submission rate achieved 96.5% compliance."
      ],
      departmentBreakdown: [
        { name: "Information Technology", active: 204, attendance: "94%" },
        { name: "Human Resources", active: 115, attendance: "91%" },
        { name: "Marketing", active: 85, attendance: "89%" },
        { name: "Finance", active: 24, attendance: "92%" }
      ]
    },
    "Past Month": {
      title: "Monthly Operations Report",
      subtitle: "Comprehensive review of the past month",
      metrics: {
        totalInterns: 485,
        activeInterns: 430,
        attendanceRate: "89.5%",
        tasksCompleted: 1840,
        newApplications: 112,
      },
      highlights: [
        "1,840 tasks assigned and verified across all departments.",
        "112 applications processed, with 34 new interns onboarded.",
        "Average internship completion score is 92.4% (Exemplary).",
        "New MOA partnership signed with De La Salle University."
      ],
      departmentBreakdown: [
        { name: "Information Technology", active: 210, attendance: "92%" },
        { name: "Human Resources", active: 120, attendance: "88%" },
        { name: "Marketing", active: 90, attendance: "87%" },
        { name: "Finance", active: 25, attendance: "91%" }
      ]
    },
    "Yearly": {
      title: "Annual HRIMS Review",
      subtitle: "FY 2026 Comprehensive Evaluation",
      metrics: {
        totalInterns: 1520,
        activeInterns: 470,
        attendanceRate: "92.1%",
        tasksCompleted: 24500,
        newApplications: 1420,
      },
      highlights: [
        "1,050 interns successfully graduated and completed required hours.",
        "Over 24,500 internship milestones and tasks tracked.",
        "Collaborated with 12 active partner universities nationwide.",
        "94% post-internship supervisor satisfaction rate achieved."
      ],
      departmentBreakdown: [
        { name: "Information Technology", active: 650, attendance: "95%" },
        { name: "Human Resources", active: 420, attendance: "91%" },
        { name: "Marketing", active: 380, attendance: "89%" },
        { name: "Finance", active: 70, attendance: "93%" }
      ]
    }
  }), []);

  useEffect(() => {
    setReportData(dataMap[timeframe]);
  }, [timeframe, dataMap]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (!reportData) return;
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += `Report: ${reportData.title}\n`;
    csvContent += `Period: ${timeframe}\n`;
    csvContent += `Generated At: ${new Date().toLocaleString()}\n\n`;
    csvContent += "Metric,Value\n";
    csvContent += `Total Interns,${reportData.metrics.totalInterns}\n`;
    csvContent += `Active Interns,${reportData.metrics.activeInterns}\n`;
    csvContent += `Attendance Rate,${reportData.metrics.attendanceRate}\n`;
    csvContent += `Tasks Completed,${reportData.metrics.tasksCompleted}\n`;
    csvContent += `New Applications,${reportData.metrics.newApplications}\n\n`;
    csvContent += "Department,Active Interns,Attendance Rate\n";
    reportData.departmentBreakdown.forEach((dept) => {
      csvContent += `"${dept.name}",${dept.active},${dept.attendance}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `HRIMS_Report_${timeframe.replace(" ", "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!reportData) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-[850px] rounded-2xl bg-white shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2 text-violet-600">
            <TrendingUp size={20} />
            <h2 className="text-lg font-bold text-gray-950">Generate Report Configurator</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition"
            aria-label="Close report configuration modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content & Form */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-center justify-between bg-violet-50/50 border border-violet-100 rounded-xl p-4">
            <div>
              <p className="text-xs font-semibold text-violet-700 uppercase tracking-wider">Select Report Timeframe</p>
              <p className="text-sm text-gray-600 mt-0.5">Filter statistics and logs to analyze active trends.</p>
            </div>
            <div className="flex gap-2 shrink-0">
              {["Today", "Past Week", "Past Month", "Yearly"].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    timeframe === tf
                      ? "bg-violet-600 text-white shadow"
                      : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Preview Panel */}
          <div className="border border-gray-200 rounded-xl p-6 bg-slate-50/50 space-y-5 print:border-0 print:bg-white">
            <div className="flex justify-between items-start border-b border-gray-200/80 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-gray-950">{reportData.title}</h3>
                <p className="text-xs font-semibold text-slate-500 mt-1">{reportData.subtitle} • Generated {new Date().toLocaleDateString()}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-violet-100 text-violet-700 text-[10px] font-bold uppercase tracking-wider">
                {timeframe}
              </span>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <Users size={14} />
                  <span className="text-[10px] font-semibold uppercase">Total Interns</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{reportData.metrics.totalInterns}</p>
              </div>
              <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <Calendar size={14} />
                  <span className="text-[10px] font-semibold uppercase">Active Interns</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{reportData.metrics.activeInterns}</p>
              </div>
              <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <Award size={14} />
                  <span className="text-[10px] font-semibold uppercase">Tasks Done</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{reportData.metrics.tasksCompleted}</p>
              </div>
              <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <Building2 size={14} />
                  <span className="text-[10px] font-semibold uppercase">Attendance Rate</span>
                </div>
                <p className="text-lg font-bold text-violet-600">{reportData.metrics.attendanceRate}</p>
              </div>
            </div>

            {/* Highlights */}
            <div>
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5">Key Performance Highlights</h4>
              <ul className="space-y-2">
                {reportData.highlights.map((highlight, idx) => (
                  <li key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-600 shrink-0 mt-1.5" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Department Breakdown Table */}
            <div>
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5">Department Breakdown</h4>
              <div className="overflow-x-auto bg-white border border-gray-100 rounded-lg shadow-sm">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-gray-100 font-bold text-slate-600">
                      <th className="px-4 py-2">Department</th>
                      <th className="px-4 py-2">Active Interns</th>
                      <th className="px-4 py-2 text-right">Attendance Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.departmentBreakdown.map((dept) => (
                      <tr key={dept.name} className="border-b border-gray-50 last:border-0 hover:bg-slate-50/50">
                        <td className="px-4 py-2 font-medium text-slate-900">{dept.name}</td>
                        <td className="px-4 py-2 text-slate-600">{dept.active}</td>
                        <td className="px-4 py-2 text-right font-bold text-emerald-600">{dept.attendance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-100 bg-gray-50/80 rounded-b-2xl shrink-0">
          <p className="text-[11px] text-gray-400">Generate, review, and print compiled compliance documentation.</p>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 bg-white rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              <Printer size={14} /> Print / PDF
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-semibold transition"
            >
              <FileSpreadsheet size={14} /> Export CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
