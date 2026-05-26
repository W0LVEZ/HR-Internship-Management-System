import { ArrowLeft, Download, Eye, FileDown, Filter, Search, Upload } from "lucide-react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useRef, useState } from "react";
import DocumentVault from "../../../common/components/layout/documentVault.jsx";
import { dummyFolders, mockDocumentVaultRecords } from "../../../common/utils/mockAuth.js";
import DocumentsViewModal from "../components/ui/DocumentsViewModal.jsx";

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const statusStyles = {
  Active: "bg-emerald-100 text-emerald-500",
  Pending: "bg-amber-100 text-amber-500",
  Expiring: "bg-amber-100 text-amber-500",
  Expired: "bg-rose-100 text-rose-500",
};

const exportRowsToCsv = (fileName, rows) => {
  const header = ["Name", "University / Branch", "File", "Expiry", "Status"];
  const csv = [header, ...rows]
    .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(downloadUrl);
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

const mergeUniversityBranch = (row) => `${row.university} / ${row.branch}`;

function AdminDocumentVaultOverview() {
  const navigate = useNavigate();

  return <DocumentVault onFolderSelect={(folder) => navigate(`/hr-admin/document-vault/${folder.slug}`)} />;
}

function AdminDocumentVaultDetail() {
  const navigate = useNavigate();
  const { folderId } = useParams();
  const uploadInputRef = useRef(null);
  const [openPreview, setOpenPreview] = useState(false);
  const [previewDocument, setPreviewDocument] = useState(null);
  const folder = dummyFolders.find((item) => slugify(item.title) === folderId);

  const handleUploadClick = () => {
    uploadInputRef.current?.click();
  };

  const handleUploadChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      console.log("Uploaded file:", selectedFile.name);
    }

    event.target.value = "";
  };

  const handleExport = () => {
    exportRowsToCsv(`${folderId}-documents.csv`, rows.map((row) => [
      row.name,
      mergeUniversityBranch(row),
      row.fileName,
      formatDateDisplay(row.expiryDate),
      row.status,
    ]));
  };

  const handleViewDocument = (row) => {
    setPreviewDocument({
      internName: row.name,
      universityBranch: `${row.university} / ${row.branch}`,
      requestedDate: formatDateDisplay(row.expiryDate),
      requestedStatus: row.status,
      fileName: row.fileName,
      fileSize: "1.5 MB",
      fileIcon: (
        <svg width="15" height="15" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 15.25C19.8968 15.25 20.8938 16.0344 20.6035 17.1748C20.0804 19.2295 18.2187 20.75 16 20.75H4V19.25C5.51631 19.25 6.79146 18.2107 7.14941 16.8047C7.34171 16.0495 8.00116 15.25 9 15.25H19ZM13 0C14.6569 0 16 1.34315 16 3V14.5H7.2998C6.85813 14.5001 6.50011 14.8581 6.5 15.2998C6.5 17.067 5.04261 18.4999 3.27539 18.5C1.48047 18.5 0 17.0449 0 15.25V3C0 1.34315 1.34315 0 3 0H13ZM4 9.25C3.58579 9.25 3.25 9.58579 3.25 10C3.25 10.4142 3.58579 10.75 4 10.75H8C8.41421 10.75 8.75 10.4142 8.75 10C8.75 9.58579 8.41421 9.25 8 9.25H4ZM4 4.25C3.58579 4.25 3.25 4.58579 3.25 5C3.25 5.41421 3.58579 5.75 4 5.75H12C12.4142 5.75 12.75 5.41421 12.75 5C12.75 4.58579 12.4142 4.25 12 4.25H4Z" fill="#7C3EFF"/>
        </svg>
      ),
    });
    setOpenPreview(true);
  };

  if (!folder) {
    return <Navigate to="/hr-admin/document-vault" replace />;
  }

  const rows = mockDocumentVaultRecords[folderId] ?? [];

  return (
    <div className="space-y-5">
      <div className="mt-6 mb-4">
        <button
          type="button"
          onClick={() => navigate("/hr-admin/document-vault")}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-800"
          aria-label="Back to folder list"
        >
          <ArrowLeft size={18} />
        </button>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5">
        <div className="border-b border-slate-100 pb-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full max-w-[320px]">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:ring-0"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 md:ml-auto md:justify-end">
              <button
                type="button"
                onClick={handleUploadClick}
                className="inline-flex items-center gap-2 rounded-2xl bg-indigo-900 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-950"
              >
                <Upload size={16} />
                Upload
              </button>
              <button
                type="button"
                onClick={handleExport}
                className="inline-flex items-center gap-2 rounded-2xl bg-violet-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700"
              >
                <FileDown size={16} />
                Export
              </button>
              <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                <Filter size={16} />
                Filter
              </button>
            </div>
          </div>
        </div>

        <input ref={uploadInputRef} type="file" className="hidden" onChange={handleUploadChange} />

        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-white text-xs text-slate-400">
              <tr className="border-b border-slate-200">
                <th className="w-12 px-4 py-3"></th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">University / Branch</th>
                <th className="px-4 py-3 font-medium">File</th>
                <th className="px-4 py-3 font-medium">Expiry</th>
                <th className="px-4 py-3 font-medium text-center">Status</th>
                <th className="px-4 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={`${row.file}-${index}`} className="border-b border-slate-100 last:border-none hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                  </td>
                  <td className="px-4 py-3 text-slate-700">{row.name ?? row.university}</td>
                  <td className="px-4 py-3 text-slate-500">{mergeUniversityBranch(row)}</td>
                  <td className="px-4 py-3 text-slate-700">{row.fileName}</td>
                  <td className="px-4 py-3 text-slate-500">{formatDateDisplay(row.expiryDate)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${statusStyles[row.status] ?? "bg-slate-100 text-slate-500"}`}>
                      {row.status}
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
                      <button className="transition hover:text-violet-500" aria-label="Download document">
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
      />
    </div>
  );
}

export default function AdminDocumentVault() {
  const { folderId } = useParams();

  if (folderId) {
    return <AdminDocumentVaultDetail />;
  }

  return <AdminDocumentVaultOverview />;
}
