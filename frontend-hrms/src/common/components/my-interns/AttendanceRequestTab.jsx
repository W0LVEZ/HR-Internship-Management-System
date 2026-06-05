import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Eye, Filter, Pencil, Search, X } from "lucide-react";
import { mockAttendanceRequests } from "../../utils/mockAuth";

const REQUEST_STORAGE_KEYS = ["hrims_attendance_requests", "hrims_attendance_requests_db"];

const statusStyles = {
  Pending: "bg-amber-100 text-amber-600",
  Approved: "bg-emerald-100 text-emerald-600",
  Rejected: "bg-rose-100 text-rose-600",
};



const attendanceStatusOptions = [
  "Absent",
  "On Time",
  "Late",
  "Excused",
];

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  }).format(date);
};

const readRequests = () => {
  const combined = REQUEST_STORAGE_KEYS.flatMap((key) => {
    try {
      const stored = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  });

  const uniqueById = new Map();

  combined.forEach((request) => {
    if (request?.id) {
      uniqueById.set(request.id, request);
    }
  });

  return [...uniqueById.values()].sort((left, right) => {
    const leftDate = new Date(left.submittedAt || left.date || 0).getTime();
    const rightDate = new Date(right.submittedAt || right.date || 0).getTime();

    return rightDate - leftDate;
  });
};

const saveRequests = (requests) => {
  const serialized = JSON.stringify(requests);
  REQUEST_STORAGE_KEYS.forEach((key) => localStorage.setItem(key, serialized));
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${
        statusStyles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

function DetailModal({ request, onClose, onSave }) {
  const [status, setStatus] = useState(request?.status || "Pending");

  useEffect(() => {
    setStatus(request?.status || "Pending");
  }, [request]);

  if (!request) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-[92%] max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Attendance Request Details</h2>
            <p className="text-sm text-gray-500">Review the request and update its status.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close request details"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-4 text-sm md:grid-cols-2">
          <Info label="Intern Name" value={request.internName} />
          <Info label="Date" value={formatDate(request.date)} />
          <Info label="Issue Type" value={request.requestType || "-"} />
          <Info label="Date Requested" value={formatDate(request.submittedAt || request.date)} />
          <Info label="Time In" value={request.timeIn || "-"} />
          <Info label="Time Out" value={request.timeOut || "-"} />
          <div className="md:col-span-2">
            <Info label="Reason" value={request.reason || "-"} />
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Current Status</p>
            <StatusBadge status={request.status || "Pending"} />
          </div>
        </div>

      </div>
    </div>
  );
}

function EditAttendanceModal({ request, onClose, onSave }) {
  const [status, setStatus] = useState(request?.status || "Pending");
  const [attendanceStatus, setAttendanceStatus] = useState(request?.requestType || "Absent");
  
  useEffect(() => {
    setStatus(request?.status || "Pending");
  }, [request]);

  if (!request) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-[92%] max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        
        {/* Header */}
        <h2 className="mb-5 text-lg font-semibold text-gray-900">
          Edit Attendance
        </h2>

        {/* Intern Name */}
        <div className="mb-4">
          <label className="mb-1 block text-xs font-semibold text-gray-700">
            Intern Name
          </label>
          <input
            type="text"
            value={request.internName || ""}
            readOnly
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-gray-50"
          />
        </div>

        {/* Time In / Time Out */}
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">
              Time In
            </label>
            <input
              type="text"
              value={request.timeIn || "-"}
              readOnly
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-gray-50"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">
              Time Out
            </label>
            <input
              type="text"
              value={request.timeOut || "-"}
              readOnly
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-gray-50"
            />
          </div>
        </div>

        {/* Date / Status */}
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">
              Date
            </label>
            <input
              type="text"
              value={formatDate(request.date)}
              readOnly
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-gray-50"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700">
                Issue Type
            </label>

            <select
                value={attendanceStatus}
                onChange={(e) => setAttendanceStatus(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-700 outline-none"
            >
                {attendanceStatusOptions.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
                ))}
            </select>
          </div>
        </div>

        {/* Reason */}
        <div className="mb-4">
          <label className="mb-1 block text-xs font-semibold text-gray-700">
            Reason
          </label>
          <textarea
            value={request.reason || "-"}
            readOnly
            rows={3}
            className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm bg-gray-50"
          />
        </div>

        {/* Supporting Document */}
        <div className="mb-6">
          <label className="mb-1 block text-xs font-semibold text-gray-700">
            Supporting Document
          </label>

          <div className="text-sm text-gray-700 underline">
            {request.supportingDocument || "No document uploaded"}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3">
            <button
                type="button"
                onClick={() => {
                    onSave({
                        ...request,
                        requestType: attendanceStatus,
                    });
                    onClose();
                }}
                className="rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                Back
            </button>
            <button
                type="button"
                onClick={() =>
                    onSave({
                        ...request,
                        status: "Pending",
                        requestType: attendanceStatus,
                    })
                }
                className="rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                Pending
            </button>
            <button
                type="button"
                onClick={() =>
                    onSave({
                        ...request,
                        status: "Rejected",
                        requestType: attendanceStatus,
                    })
                }
                className="rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                Reject
            </button>
            <button
                type="button"
                onClick={() =>
                    onSave({
                        ...request,
                        status: "Approved",
                        requestType: attendanceStatus,
                    })
                }
                className="rounded-md bg-violet-600 px-5 py-2 text-sm font-medium text-white hover:bg-violet-700"
                >
                Approve
            </button>
        </div>
    </div>
</div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
      <p className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-800">
        {value}
      </p>
    </div>
  );
}

export default function AttendanceRequestTab() {
  const [search, setSearch] = useState("");
  const [requests, setRequests] = useState(mockAttendanceRequests);
  const [viewRequest, setViewRequest] = useState(null);
  const [editRequest, setEditRequest] = useState(null);

  useEffect(() => {
    const handleStorage = () => setRequests(readRequests());

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const filteredRequests = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return requests;

    return requests.filter((request) => {
      const searchable = [
        request.internName,
        request.requestType,
        request.date,
        request.submittedAt,
        request.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [requests, search]);

    const handleSave = (updatedRequest) => {
        const nextRequests = requests.map((request) =>
            request.id === updatedRequest.id
            ? updatedRequest
            : request
        );

        setRequests(nextRequests);
        saveRequests(nextRequests);
        setEditRequest(null);
    };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-[340px]">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search requests..."
            className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-violet-400"
          />
        </div>

        <button className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
          <Filter size={16} />
          Filter
        </button>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-gray-100">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-white text-xs text-gray-400">
            <tr className="border-b border-gray-100">
              <th className="px-4 py-3 font-medium">Intern Name</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Issue Type</th>
              <th className="px-4 py-3 font-medium">Date Requested</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <tr key={request.id} className="border-b border-gray-100 last:border-none hover:bg-gray-50">
                  <td className="px-4 py-4 font-medium text-gray-800">{request.internName || "-"}</td>
                  <td className="px-4 py-4 text-gray-600">{formatDate(request.date)}</td>
                  <td className="px-4 py-4 text-gray-600">
                    {request.requestType || "-"}
                  </td>
                  <td className="px-4 py-4 text-gray-600">
                    {formatDate(request.submittedAt || request.date)}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={request.status || "Pending"} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-center gap-3 text-gray-500">
                      <button
                        type="button"
                        onClick={() => setViewRequest(request)}
                        className="transition hover:text-violet-600"
                        aria-label="View request"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditRequest(request)}
                        className="transition hover:text-violet-600"
                        aria-label="Edit request"
                      >
                        <Pencil size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400">
                  No attendance requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {viewRequest && (
        <DetailModal
            request={viewRequest}
            onClose={() => setViewRequest(null)}
        />
      )}

      {editRequest && (
        <EditAttendanceModal
            request={editRequest}
            onClose={() => setEditRequest(null)}
            onSave={handleSave}
        />
      )}

      {filteredRequests.length > 0 && (
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
          <AlertCircle size={13} />
          Showing {filteredRequests.length} request{filteredRequests.length === 1 ? "" : "s"}
        </div>
      )}
    </div>
  );
}