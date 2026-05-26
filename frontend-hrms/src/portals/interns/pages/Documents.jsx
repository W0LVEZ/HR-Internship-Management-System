import { useState, useEffect } from "react";
import { Eye, Download, ScrollText } from "lucide-react";

import SearchInput from "../../../common/components/ui/SearchInput";

import UploadModal from "../components/ui/UploadModal";
import RequestModal from "../components/ui/RequestModal";
import RequestDropdown from "../components/ui/RequestDropdown";

export default function Documents() {
  const [search, setSearch] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);

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

  useEffect(() => {
    const handleClickOutside = () => setShowDropDown(false);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <>
      <div className="px-6 space-y-5">
        {/* This is the top bar */}
        <div className="flex justify-between items-center">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Documents..."
          />

          <div className="flex gap-3 relative">
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
          {documents.map((doc) => (
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
                <span
                  className={`text-xs px-2 py-1 rounded-md font-medium
            ${
              doc.status === "Approved"
                ? "bg-green-100 text-green-600"
                : "bg-yellow-100 text-yellow-600"
            }`}
                >
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
      </div>

      {/* Modals */}
      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
      {showRequestModal && (
        <RequestModal onClose={() => setShowRequestModal(false)} />
      )}
    </>
  );
}
