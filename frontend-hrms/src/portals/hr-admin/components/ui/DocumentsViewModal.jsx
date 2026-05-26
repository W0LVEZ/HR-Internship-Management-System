import { useEffect, useState } from "react";

export default function DocumentsViewModal({
  isOpen,
  onClose,
  document,
  dateLabel = "Expiry Date",
  showReviewActions = false,
  onPending,
  onApprove,
  onReject,
}) {
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    setRemarks(document?.remarks ?? "");
  }, [document, isOpen]);

  if (!isOpen || !document) return null;

  const statusStyles = {
    Active: "bg-emerald-100 text-emerald-500",
    Verified: "bg-emerald-100 text-emerald-600",
    Expiring: "bg-amber-100 text-amber-500",
    Pending: "bg-yellow-200/70 text-yellow-500",
    Expired: "bg-rose-100 text-rose-500",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-[90%] max-w-lg rounded-2xl bg-white p-4 shadow-lg sm:p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-base font-semibold">Request Details</h2>

        <div className="grid gap-4 text-sm md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="font-semibold">Intern Name</h1>
              <input
                type="text"
                value={document.internName}
                className="outline-none px-2 py-1 border border-gray-300 rounded-lg bg-gray-100/50 cursor-not-allowed"
                readOnly
              />
            </div>
            <div>
              <h1 className="font-semibold">University / Branch</h1>
              <input
                type="text"
                value={document.universityBranch ?? "-"}
                className="outline-none px-2 py-1 border border-gray-300 rounded-lg bg-gray-100/50 cursor-not-allowed"
                readOnly
              />
            </div>
            <div>
              <h1 className="font-semibold">{dateLabel}</h1>
              <input
                type="text"
                value={document.requestedDate}
                className="outline-none px-2 py-1 border border-gray-300 rounded-lg bg-gray-100/50 cursor-not-allowed"
                readOnly
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
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
              <div className={`inline-block rounded-lg p-1 text-xs ${statusStyles[document.requestedStatus] ?? "bg-slate-100 text-slate-500"}`}>
                <span>{document.requestedStatus}</span>
              </div>
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="mt-1">
              <h3 className="text-sm font-medium mb-2">Remarks</h3>
              <textarea
                value={remarks}
                onChange={(event) => setRemarks(event.target.value)}
                placeholder="Add a short review note"
                rows={4}
                className="w-full resize-none rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-sm outline-none transition focus:border-violet-400"
              />
            </div>

            {!showReviewActions && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Upload File (optional)</h3>

                <div className="rounded-xl border-2 border-dashed border-violet-400 bg-violet-50/30 p-4 text-center">
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

                  <p className="text-sm text-gray-700">
                    Drag & Drop or{" "}
                    <label className="text-violet-600 cursor-pointer underline">
                      choose file
                      <input type="file" className="hidden" />
                    </label>{" "}
                    to upload
                  </p>

                  <p className="text-xs text-gray-400 mt-1">Supported formats : docs, pdf</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap justify-end gap-2 sm:gap-3">
          {showReviewActions ? (
            <>
              <button
                onClick={onClose}
                className="cursor-pointer rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onPending?.(remarks);
                  onClose();
                }}
                className="cursor-pointer rounded-md border border-amber-200 px-4 py-2 text-sm font-medium text-amber-600 transition hover:bg-amber-50"
              >
                Pending
              </button>
              <button
                onClick={() => {
                  onReject?.(remarks);
                  onClose();
                }}
                className="cursor-pointer rounded-md border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
              >
                Reject
              </button>
              <button
                onClick={() => {
                  onApprove?.(remarks);
                  onClose();
                }}
                className="cursor-pointer rounded-md border border-emerald-200 px-4 py-2 text-sm font-medium text-emerald-600 transition hover:bg-emerald-50"
              >
                Approve
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="cursor-pointer rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button className="cursor-pointer rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700">
                Submit
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
