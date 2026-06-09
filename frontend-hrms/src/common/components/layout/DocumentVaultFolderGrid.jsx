import { Search, Upload, Download, Filter, FolderOpen, TriangleAlert } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { dummyFolders, mockDocumentVaultRecords } from '../../../common/utils/mockAuth.js';

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const DOCUMENT_VAULT_STORAGE_KEY = 'hrims_document_vault_records';

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

const isExpiringSoon = (expiryDate) => {
  const date = new Date(expiryDate);

  if (Number.isNaN(date.getTime())) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  const daysUntilExpiry = Math.ceil((date - today) / (1000 * 60 * 60 * 24));

  return daysUntilExpiry >= 0 && daysUntilExpiry <= 30;
};

const isExpired = (expiryDate) => {
  const date = new Date(expiryDate);

  if (Number.isNaN(date.getTime())) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  return date < today;
};

export default function DocumentVaultFolderGrid({ onFolderSelect }) {
  const uploadInputRef = useRef(null);
  const [search, setSearch] = useState('');
  const [filterOption, setFilterOption] = useState('All'); // 'All', 'Expiring', 'Expired'
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const documentVaultRecords = getDocumentVaultRecords();
  const folders = useMemo(
    () =>
      dummyFolders.map((folder) => {
        const folderId = slugify(folder.title);
        const records = documentVaultRecords[folderId] ?? [];

        return {
          ...folder,
          files: records.length,
          expiringSoon: records.filter((record) => isExpiringSoon(record.expiryDate)).length,
          expired: records.filter((record) => isExpired(record.expiryDate)).length,
          records,
        };
      }),
    [documentVaultRecords],
  );

  const normalizedSearch = search.trim().toLowerCase();

  const filteredFolders = folders.filter((folder) => {
    // Apply status filter
    if (filterOption === 'Expiring' && folder.expiringSoon === 0) return false;
    if (filterOption === 'Expired' && folder.expired === 0) return false;

    if (!normalizedSearch) return true;

    const folderMatches = folder.title.toLowerCase().includes(normalizedSearch);

    const recordMatches = folder.records.some((record) => {
      const searchableText = [
        record.name,
        record.university,
        record.branch,
        record.fileName,
        record.status,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableText.includes(normalizedSearch);
    });

    return folderMatches || recordMatches;
  });

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
    const rows = folders.map((folder) => [
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
                value={search}
                onChange={(event) => setSearch(event.target.value)}
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
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition hover:bg-slate-50 cursor-pointer ${
                  filterOption !== 'All'
                    ? 'border-indigo-500 text-indigo-600 bg-indigo-50/50'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                <Filter size={16} />
                Filter {filterOption !== 'All' && "•"}
              </button>
              {showFilterDropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-slate-200 bg-white shadow-lg z-50">
                  <div className="p-3 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-600 uppercase">Folder Status</p>
                  </div>
                  <div className="p-3 space-y-2">
                    {[
                      { value: 'All', label: 'All Folders' },
                      { value: 'Expiring', label: 'Has Expiring Soon' },
                      { value: 'Expired', label: 'Has Expired' },
                    ].map((opt) => (
                      <label key={opt.value} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded animate-fade-in">
                        <input
                          type="radio"
                          name="folderFilter"
                          checked={filterOption === opt.value}
                          onChange={() => {
                            setFilterOption(opt.value);
                            setShowFilterDropdown(false);
                          }}
                          className="h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm font-medium text-slate-700">
                          {opt.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <input ref={uploadInputRef} type="file" className="hidden" onChange={handleUploadChange} />

        <div className="grid gap-3 sm:grid-cols-3">
          {filteredFolders.length > 0 ? (
            filteredFolders.map((folder) => (
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
                {folder.expiringSoon > 0 ? (
                  <span className="inline-flex items-center gap-1 text-amber-600">
                    <TriangleAlert size={13} />
                    {folder.expiringSoon} expiring soon
                  </span>
                ) : null}
                {folder.expired > 0 ? (
                  <span className="inline-flex items-center gap-1 text-rose-600">
                    <TriangleAlert size={13} />
                    {folder.expired} expired
                  </span>
                ) : null}
                <span className="text-slate-400">Updated {folder.updatedAgo}</span>
              </div>
            </button>
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
              No matching folders found.
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
          <FolderOpen size={36} className="mb-3 text-slate-300" />
          <p className="text-sm">Select a folder or search to open a record.</p>
        </div>
      </div>
    </div>
  );
}