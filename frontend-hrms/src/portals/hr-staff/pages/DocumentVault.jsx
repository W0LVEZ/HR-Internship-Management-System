import { Download, Eye, Filter, Search } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import { mockDocumentVaultRecords } from "../../../common/utils/mockAuth.js";
import DocumentsViewModal from "../../hr-admin/components/ui/DocumentsViewModal.jsx";

const vaultTabs = [
  { label: "MOA", key: "moa" },
  { label: "NDA", key: "nda" },
  { label: "COA", key: "coa" },
  { label: "Endorsement", key: "endorsement-letter" },
];

const staffDocumentVaultRecords = {
  ...mockDocumentVaultRecords,
  coa: [
    {
      id: "coa-1",
      name: "Student 5",
      university: "University 4",
      branch: "Branch 1",
      fileName: "COA-university-Branch 1",
      expiryDate: "2026-06-14",
      status: "Active",
      updatedAt: "2026-05-18",
    },
    {
      id: "coa-2",
      name: "Student 6",
      university: "University 4",
      branch: "Branch 2",
      fileName: "COA-university-Branch 2",
      expiryDate: "2026-06-07",
      status: "Pending",
      updatedAt: "2026-05-16",
    },
    {
      id: "coa-3",
      name: "Student 7",
      university: "University 5",
      branch: "Main Campus",
      fileName: "COA-university-Main Campus",
      expiryDate: "2026-05-27",
      status: "Expiring",
      updatedAt: "2026-05-15",
    },
  ],
};

const statusStyles = {
  Verified: "bg-emerald-100 text-emerald-600",
  Pending: "bg-amber-100 text-amber-600",
  Expiring: "bg-amber-100 text-amber-600",
  Expired: "bg-rose-100 text-rose-600",
  Rejected: "bg-rose-100 text-rose-600",
};

const formatDateDisplay = (dateValue) => {
  if (!dateValue) return "-";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return dateValue;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
};

const formatStatusLabel = (status) => {
  if (status === "Active") return "Verified";
  return status;
};

export default function DocumentVault() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("moa");
  const [recordsByTab, setRecordsByTab] = useState(staffDocumentVaultRecords);
  const [openPreview, setOpenPreview] = useState(false);
  const [previewDocument, setPreviewDocument] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedTab, setSelectedTab] = useState(null);

  if (currentUser?.role && currentUser.role !== "HR_STAFF" && currentUser.role !== "ADMIN") {
    return <Navigate to="/hr-staff" replace />;
  }

  const rows = recordsByTab[activeTab] ?? [];

  const updateSelectedRow = (nextStatus, remarks) => {
    if (!selectedTab || !selectedRecord) return;

    setRecordsByTab((previousRecords) => ({
      ...previousRecords,
      [selectedTab]: (previousRecords[selectedTab] ?? []).map((row) =>
        row.id === selectedRecord.id ? { ...row, status: nextStatus, remarks } : row,
      ),
    }));
  };

  const handleViewDocument = (row) => {
    setSelectedRecord(row);
    setSelectedTab(activeTab);
    setPreviewDocument({
      internName: row.name,
      universityBranch: `${row.university} / ${row.branch}`,
      requestedDate: formatDateDisplay(row.updatedAt),
      requestedStatus: formatStatusLabel(row.status),
      fileName: row.fileName,
      fileSize: "1.5 MB",
      remarks:
        row.remarks ??
        `Review note for ${row.name}: ${row.status === "Expired" ? "Please follow up before approval." : "Document is ready for review."}`,
      fileIcon: (
        <svg width="15" height="15" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 15.25C19.8968 15.25 20.8938 16.0344 20.6035 17.1748C20.0804 19.2295 18.2187 20.75 16 20.75H4V19.25C5.51631 19.25 6.79146 18.2107 7.14941 16.8047C7.34171 16.0495 8.00116 15.25 9 15.25H19ZM13 0C14.6569 0 16 1.34315 16 3V14.5H7.2998C6.85813 14.5001 6.50011 14.8581 6.5 15.2998C6.5 17.067 5.04261 18.4999 3.27539 18.5C1.48047 18.5 0 17.0449 0 15.25V3C0 1.34315 1.34315 0 3 0H13ZM4 9.25C3.58579 9.25 3.25 9.58579 3.25 10C3.25 10.4142 3.58579 10.75 4 10.75H8C8.41421 10.75 8.75 10.4142 8.75 10C8.75 9.58579 8.41421 9.25 8 9.25H4ZM4 4.25C3.58579 4.25 3.25 4.58579 3.25 5C3.25 5.41421 3.58579 5.75 4 5.75H12C12.4142 5.75 12.75 5.41421 12.75 5C12.75 4.58579 12.4142 4.25 12 4.25H4Z" fill="#7C3EFF"/>
        </svg>
      ),
    });

    setOpenPreview(true);
  };

  const handleDownloadDocument = (row) => {
    console.log("Download requested for:", row.fileName);
  };

  const handleApprove = (remarks) => {
    updateSelectedRow("Active", remarks);
  };

  const handleReject = (remarks) => {
    updateSelectedRow("Rejected", remarks);
  };

  const handleCancelReview = () => {
    updateSelectedRow("Pending", "");
  };

  return (
    <div className="space-y-5">
      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-4 border-b border-slate-100 pb-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-[240px]">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search"
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:ring-0"
              />
            </div>

            <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
              <Filter size={16} />
              Filter
            </button>
          </div>

          <div className="flex flex-wrap gap-6 border-b border-slate-200 text-sm">
            {vaultTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`relative pb-3 font-medium transition ${
                  activeTab === tab.key ? "text-violet-600" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
                {activeTab === tab.key && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-violet-600" />}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-white text-xs text-slate-400">
              <tr className="border-b border-slate-200">
                <th className="w-12 px-4 py-3"></th>
                <th className="px-4 py-3 font-medium">File Name</th>
                <th className="px-4 py-3 font-medium">Intern Name</th>
                <th className="px-4 py-3 font-medium">Date Uploaded</th>
                <th className="px-4 py-3 font-medium text-center">Status</th>
                <th className="px-4 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={`${row.id}-${index}`} className="border-b border-slate-100 last:border-none hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500" />
                  </td>
                  <td className="px-4 py-3 text-slate-700">{row.fileName}</td>
                  <td className="px-4 py-3 text-slate-700">{row.name}</td>
                  <td className="px-4 py-3 text-slate-500">{formatDateDisplay(row.updatedAt)}</td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${
                        statusStyles[formatStatusLabel(row.status)] ?? "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {formatStatusLabel(row.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3 text-slate-500">
                      <button
                        type="button"
                        onClick={() => handleViewDocument(row)}
                        className="transition hover:text-violet-500"
                        aria-label="View document"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadDocument(row)}
                        className="transition hover:text-violet-500"
                        aria-label="Download document"
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DocumentsViewModal
        isOpen={openPreview}
        onClose={() => setOpenPreview(false)}
        document={previewDocument}
        dateLabel="Date Uploaded"
        showReviewActions
        onApprove={handleApprove}
        onReject={handleReject}
        onCancel={handleCancelReview}
      />
    </div>
  );
}
