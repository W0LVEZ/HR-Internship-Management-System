import { useState, useEffect } from "react";
import { Eye, Download, ScrollText, Search, Filter } from "lucide-react";

import SearchInput from "../../../common/components/ui/SearchInput";

import UploadModal from "../components/ui/UploadModal";
import RequestModal from "../components/ui/RequestModal";
import RequestDropdown from "../components/ui/RequestDropdown";

const statusStyles = {
  Approved: "bg-emerald-100 text-emerald-600",
  Pending: "bg-amber-100 text-amber-600",
  Rejected: "bg-rose-100 text-rose-600",
};

export default function Documents() {
  const [search, setSearch] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState(["Approved", "Pending", "Rejected"]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const documents = [
    {
      id: 1,
      name: "Evaluation.pdf",
      date: "02-12-2026",
      documentType: "Evaluation Form",
      dueDate: "05-22-2026",
      status: "Approved",
    },
    {
      id: 2,
      name: "COC.pdf",
      date: "02-12-2026",
      documentType: "Certificate of Completion",
      dueDate: "05-22-2026",
      status: "Pending",
    },
  ];

  const toggleStatusFilter = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesStatus = selectedStatuses.includes(doc.status);
    const matchesSearch =
      search === "" ||
      doc.name?.toLowerCase().includes(search.toLowerCase()) ||
      doc.documentType?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  useEffect(() => {
    const handleClickOutside = () => setShowDropDown(false);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <>
      <div className="px-6 space-y-5">
        {/* This is the top bar */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full max-w-[320px]">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:ring-0"
            />
          </div>

          <div className="flex gap-3 relative md:ml-auto">
            <button
              onClick={() => setShowUpload(true)}
              className="bg-linear-to-r from-primary to-[#9F67FF] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90"
            >
              Upload Document
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDropDown((prev) => !prev);
              }}
              className="border border-primary text-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-50 flex items-center gap-2"
            >
              Request Document
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
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

            {showDropDown && (
              <RequestDropdown
                onSelect={(type) => {
                  setShowDropDown(false);

                  if (type === "Others") {
                    setShowRequestModal(true);
                  } else {
                    console.log("Request: ", type);

                    //POST /documents/request
                  }
                }}
              />
            )}
          </div>
        </div>

        {/* Document Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-6 px-6 py-3 text-xs text-gray-400 font-semibold border-b border-gray-200">
            <p>File Name</p>
            <p className="text-center">Date Requested</p>
            <p className="text-center">Document Type</p>
            <p className="text-center">Due Date</p>
            <p className="text-center">Status</p>
            <p className="text-right">Action</p>
          </div>

          {/* Rows */}
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="grid grid-cols-6 px-6 py-4 items-center border-b border-gray-200 last:border-none hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center text-purple-500 rounded-lg">
                  <ScrollText size={22} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {doc.name}
                  </p>
                  <p className="text-xs text-gray-400">1.5 MB</p>
                </div>
              </div>

              <p className="text-sm text-gray-500 text-center">{doc.date}</p>
              <p className="text-sm text-gray-500 text-center">{doc.documentType}</p>
              <p className="text-sm text-gray-500 text-center">{doc.dueDate}</p>
              <div className="text-center">
                <span className={`text-xs px-2 py-1 rounded-md font-medium ${statusStyles[doc.status] ?? "bg-slate-100 text-slate-500"}`}>
                  {doc.status}
                </span>
              </div>

              <div className="flex justify-end gap-3 text-gray-500">
                <button className="hover:text-purple-500">
                  <Eye size={18} />
                </button>
                <button className="hover:text-purple-500">
                  <Download size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
            <p className="text-slate-600">No documents match your filters. Try adjusting your search or status filters.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
      {showRequestModal && (
        <RequestModal onClose={() => setShowRequestModal(false)} />
      )}
    </>
  );
}
