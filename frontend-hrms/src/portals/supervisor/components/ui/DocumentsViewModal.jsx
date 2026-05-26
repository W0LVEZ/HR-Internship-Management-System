export default function DocumentsViewModal({ isOpen, onClose, document }) {
  if (!isOpen || !document) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white w-[90%] max-w-md rounded-lg p-5 relative shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">
          Request Details
        </h2>

        <div className="grid text-sm">
            <div className="flex flex-col p-2 gap-5">
              <div>
                <h1 className="font-semibold">Intern Name</h1>
                <input type="text" value={document.internName} className="outline-none px-2 py-1 border border-gray-300 rounded-lg bg-gray-100/50 cursor-not-allowed" readOnly />
              </div>
              <div>
                <h1 className="font-semibold">Requested</h1>
                <input type="text" value={document.requestedDate} className="outline-none px-2 py-1 border border-gray-300 rounded-lg bg-gray-100/50 cursor-not-allowed" readOnly />
              </div>
              <div>
                <h1 className="font-semibold">Document Type</h1>
                <input type="text" value={document.documentType ?? "-"} className="outline-none px-2 py-1 border border-gray-300 rounded-lg bg-gray-100/50 cursor-not-allowed" readOnly />
              </div>
              <div>
                <h1 className="font-semibold">Due Date</h1>
                <input type="text" value={document.dueDate ?? "-"} className="outline-none px-2 py-1 border border-gray-300 rounded-lg bg-gray-100/50 cursor-not-allowed" readOnly />
              </div>
            </div>
            <div className="flex flex-col p-2 gap-5">
              <div>
                <h1 className="font-semibold">File Name</h1>
                <div className="flex justify-start items-center gap-2">
                    {document.fileIcon}
                    <div className="flex flex-col gap-0">
                      <p className="font-semibold">{document.fileName}</p>
                      <span className="text-gray-400 text-xs">{document.fileSize}</span>
                    </div>
                  </div>
              </div>
              <div>
                <h1 className="font-semibold">Requested Status</h1>
                {document.requestedStatus === "Approved" ? (
                  <div className="bg-green-200 text-xs text-green-500 inline-block p-1 rounded-lg">
                    <span>{document.requestedStatus}</span>
                  </div>) : document.requestedStatus === "Pending" ? (
                    <div className="bg-yellow-200/70 text-xs text-yellow-400 inline-block p-1 rounded-lg">
                      <span>{document.requestedStatus}</span>
                    </div>) : (
                      <div className="bg-red-100 text-xs text-red-500 inline-block p-1 rounded-lg">
                        <span>{document.requestedStatus}</span>
                      </div>
                    )}
              </div>
            </div>
            <div className="col-span-2">
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">
                  Upload File (optional)
                </h3>

                <div className="border-2 border-dashed border-violet-400 rounded-xl p-6 text-center bg-violet-50/30">

                  {/* Upload Icon */}
                  <div className="flex justify-center mb-3">
                    <div className="bg-violet-500 text-white p-3 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 12V3m0 0l-3 3m3-3l3 3"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Text */}
                  <p className="text-sm text-gray-700">
                    Drag & Drop or{" "}
                    <label className="text-violet-600 cursor-pointer underline">
                      choose file
                      <input
                        type="file"
                        className="hidden"
                      />
                    </label>{" "}
                    to upload
                  </p>

                  {/* Supported formats */}
                  <p className="text-xs text-gray-400 mt-1">
                    Supported formats : docs, pdf
                  </p>
                </div>
              </div>
            </div>
        </div>

        <div className="flex justify-end mt-5 gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 cursor-pointer"
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-violet-500 text-white rounded hover:bg-violet-600 cursor-pointer">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}