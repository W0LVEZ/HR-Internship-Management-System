import { Search, Upload, Download, Filter, FolderOpen, TriangleAlert } from 'lucide-react';
import { useRef } from 'react';
import { dummyFolders } from '../../../common/utils/mockAuth.js';
import { useAuth } from '../../../contexts/AuthContext.jsx';

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export default function DocumentVault({ onFolderSelect }) {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'ADMIN';
  const uploadInputRef = useRef(null);

  const handleUploadClick = () => {
    uploadInputRef.current?.click();
  };

  const handleUploadChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      console.log('Uploaded file:', selectedFile.name);
    }

    event.target.value = '';
  };

  const handleExport = () => {
    const header = ['Title', 'Files', 'Expiring Soon', 'Updated'];
    const rows = dummyFolders.map((folder) => [
      folder.title,
      folder.files,
      folder.expiringSoon,
      folder.updatedAgo,
    ]);

    const csvContent = [header, ...rows]
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'document-vault.csv';
    link.click();
    URL.revokeObjectURL(downloadUrl);
  };

  return (
    <div className="space-y-5">
      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-3 border-b border-slate-100 pb-5 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full max-w-[320px]">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search documents"
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
              <Download size={16} />
              Export
            </button>
            <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
              <Filter size={16} />
              Filter
            </button>
          </div>
        </div>

        <input ref={uploadInputRef} type="file" className="hidden" onChange={handleUploadChange} />

        <div className="grid gap-3 sm:grid-cols-3">
          {dummyFolders.map((folder) => (
            <button
              key={folder.title}
              type="button"
              onClick={() => onFolderSelect?.({ ...folder, slug: slugify(folder.title) })}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-slate-300 hover:shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className={`${folder.color} flex h-12 w-12 items-center justify-center rounded-2xl`}>
                  <FolderOpen size={20} className="text-slate-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{folder.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{folder.files} files</p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                {isAdmin && folder.expiringSoon > 0 && (
                  <span className="inline-flex items-center gap-1 text-amber-600">
                    <TriangleAlert size={13} />
                    {folder.expiringSoon} expiring soon
                  </span>
                )}
                <span className="text-slate-400">Updated {folder.updatedAgo}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
          <FolderOpen size={36} className="mb-3 text-slate-300" />
          <p className="text-sm">Select a folder or search to open a record.</p>
        </div>
      </div>
    </div>
  );
}