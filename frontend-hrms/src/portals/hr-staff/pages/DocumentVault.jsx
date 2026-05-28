import { Download, Eye, Filter, Search } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import { mockDocumentVaultRecords } from "../../../common/utils/mockAuth.js";
import { addSystemLog } from "../../../common/utils/systemLogger.js";
import DocumentsViewModal from "../../hr-admin/components/ui/DocumentsViewModal.jsx";

const vaultTabs = [
  { label: "MOA", key: "moa" },
  { label: "NDA", key: "nda" },
  { label: "COA", key: "coa" },
  { label: "Endorsement", key: "endorsement-letter" },
];

const DOCUMENT_VAULT_STORAGE_KEY = "hrims_document_vault_records";

const getDocumentVaultRecords = () => {
  const storedRecords = localStorage.getItem(DOCUMENT_VAULT_STORAGE_KEY);

  if (!storedRecords) {
    localStorage.setItem(DOCUMENT_VAULT_STORAGE_KEY, JSON.stringify(mockDocumentVaultRecords));
    return mockDocumentVaultRecords;
  }

  try {
    return JSON.parse(storedRecords);
  } catch {
    localStorage.setItem(DOCUMENT_VAULT_STORAGE_KEY, JSON.stringify(mockDocumentVaultRecords));
    return mockDocumentVaultRecords;
  }
};

const updateDocumentVaultRecord = (folderId, recordId, updater) => {
  const records = getDocumentVaultRecords();
  const nextRecords = {
    ...records,
    [folderId]: (records[folderId] || []).map((record) =>
      record.id === recordId ? updater(record) : record,
    ),
  };

  localStorage.setItem(DOCUMENT_VAULT_STORAGE_KEY, JSON.stringify(nextRecords));
  return nextRecords;
};

const statusStyles = {
  Approved: "bg-emerald-100 text-emerald-600",
  Pending: "bg-amber-100 text-amber-600",
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

const normalizeStatus = (status) => {
  if (status === "Active" || status === "Verified") return "Approved";
  if (status === "Expiring") return "Pending";
  if (status === "Expired") return "Rejected";
  return status;
};

export default function DocumentVault() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("moa");
  const [recordsByTab, setRecordsByTab] = useState(getDocumentVaultRecords());
  const [openPreview, setOpenPreview] = useState(false);
  const [previewDocument, setPreviewDocument] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedTab, setSelectedTab] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState(["Approved", "Pending", "Rejected"]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  if (currentUser?.role && currentUser.role !== "HR_STAFF" && currentUser.role !== "ADMIN") {
    return <Navigate to="/hr-staff" replace />;
  }

  const toggleStatusFilter = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const rows = recordsByTab[activeTab] ?? [];

  const filteredRows = rows.filter((row) => {
    const normalizedStatus = normalizeStatus(row.status);
    const matchesStatus = selectedStatuses.includes(normalizedStatus);
    const matchesSearch =
      searchTerm === "" ||
      row.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.fileName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.university?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.branch?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const updateSelectedRow = (nextStatus, remarks) => {
    if (!selectedTab || !selectedRecord) return;

    setRecordsByTab((previousRecords) => {
      const normalizedStatus = normalizeStatus(nextStatus);
      const nextRecords = {
        ...previousRecords,
        [selectedTab]: (previousRecords[selectedTab] ?? []).map((row) =>
          row.id === selectedRecord.id ? { ...row, status: normalizedStatus, remarks } : row,
        ),
      };

      updateDocumentVaultRecord(selectedTab, selectedRecord.id, (row) => ({
        ...row,
        status: normalizedStatus,
        remarks,
      }));

      return nextRecords;
    });
  };

  const handleViewDocument = (row) => {
    setSelectedRecord(row);
    setSelectedTab(activeTab);
    setPreviewDocument({
      internName: row.name,
      universityBranch: `${row.university} / ${row.branch}`,
      requestedDate: formatDateDisplay(row.updatedAt),
      requestedStatus: normalizeStatus(row.status),
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
    updateSelectedRow("Approved", remarks);

    addSystemLog({
      action: "DOCUMENT_APPROVED",
      title: "Document Approved",
      description: `${currentUser?.name || "HR Staff"} approved ${selectedRecord?.fileName || "a document"}.`,
      actorId: currentUser?.id || null,
      actorName: currentUser?.name || "HR Staff",
      actorRole: currentUser?.role || "HR_STAFF",
      audience: ["hr-admin"],
      metadata: {
        documentId: selectedRecord?.id,
        documentName: selectedRecord?.fileName,
        status: "Approved",
        remarks,
      },
    });
  };

  const handlePending = (remarks) => {
    updateSelectedRow("Pending", remarks);
  };

  const handleReject = (remarks) => {
    updateSelectedRow("Rejected", remarks);

    addSystemLog({
      action: "DOCUMENT_REJECTED",
      title: "Document Rejected",
      description: `${currentUser?.name || "HR Staff"} rejected ${selectedRecord?.fileName || "a document"}.`,
      actorId: currentUser?.id || null,
      actorName: currentUser?.name || "HR Staff",
      actorRole: currentUser?.role || "HR_STAFF",
      audience: ["hr-admin"],
      metadata: {
        documentId: selectedRecord?.id,
        documentName: selectedRecord?.fileName,
        status: "Rejected",
        remarks,
      },
    });
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:ring-0"
              />
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <Filter size={16} />
                Filter
              </button>
              {showFilterDropdown && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl border border-slate-200 bg-white shadow-lg z-10">
                  <div className="p-3 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-600 uppercase">Status</p>
                  </div>
                  <div className="p-3 space-y-2">
                    {["Approved", "Pending", "Rejected"].map((status) => (
                      <label key={status} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded">
                        <input
                          type="checkbox"
                          checked={selectedStatuses.includes(status)}
                          onChange={() => toggleStatusFilter(status)}
                          className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className={`text-sm font-medium inline-flex rounded-md px-2 py-1 ${statusStyles[status]}`}>
                          {status}
                        </span>
                      </label>
                    ))}
                  </div>
                  <div className="border-t border-slate-100 p-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedStatuses(["Approved", "Pending", "Rejected"])}
                      className="flex-1 text-xs font-medium text-slate-600 hover:text-slate-900 py-1"
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowFilterDropdown(false)}
                      className="flex-1 text-xs font-medium bg-indigo-900 text-white rounded-lg py-1 hover:bg-indigo-950"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
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
              {filteredRows.map((row, index) => (
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
                        statusStyles[normalizeStatus(row.status)] ?? "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {normalizeStatus(row.status)}
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

        {filteredRows.length === 0 && (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
            <p className="text-slate-600">No documents match your filters. Try adjusting your search or status filters.</p>
          </div>
        )}
      </div>

      <DocumentsViewModal
        isOpen={openPreview}
        onClose={() => setOpenPreview(false)}
        document={previewDocument}
        dateLabel="Date Uploaded"
        showReviewActions
        onPending={handlePending}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
