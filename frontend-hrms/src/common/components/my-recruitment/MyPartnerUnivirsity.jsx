import { useEffect, useState } from "react";
import {
  Building2,
  Calendar,
  Download,
  Edit3,
  Eye,
  History,
  Mail,
  MapPin,
  Phone,
  Plus,
  UserRound,
  Upload,
  X,
} from "lucide-react";
import {
  getStoredMoaUploads,
  saveMoaUploadToTemporaryDatabase,
} from "../../utils/mockAuth";
import { addSystemLog, LOG_TYPES } from "../../utils/systemLogger";
import { useAuth } from "../../../contexts/AuthContext";
import UploadMOA from "../../../portals/hr-admin/pages/UploadMOA";

export default function MyPartnerUnivirsity({
  universities = [],
  interns = [],
  search = "",
}) {
  const { currentUser } = useAuth();
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [showUploadMoa, setShowUploadMoa] = useState(false);
  const [moaUploads, setMoaUploads] = useState({});

  useEffect(() => {
    setMoaUploads(getStoredMoaUploads());
  }, []);

  const filteredUniversities = universities.filter((university) =>
    university.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (selectedUniversity) {
    const universityInterns = interns.filter(
      (intern) => intern.uni === selectedUniversity.name,
    );
    const currentMoa = moaUploads[selectedUniversity.id];

    return (
      <div className="pt-2">
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => setSelectedUniversity(null)}
            className="flex items-center gap-3 text-left group"
          >
            <div className="w-12 h-12 rounded-full bg-violet-300 text-white flex items-center justify-center font-bold shrink-0">
              {getInitials(selectedUniversity.name)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-950 group-hover:text-violet-600 transition-colors">
                {selectedUniversity.name}
              </h2>
              <p className="text-xs font-medium text-gray-600">
                {selectedUniversity.branch}
              </p>
            </div>
          </button>

          <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">
            <Edit3 size={16} />
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.95fr] gap-5 mb-5">
          <section className="border border-gray-100 rounded-lg p-5">
            <h3 className="text-lg font-bold text-gray-950 mb-4">
              Contact Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 border-t border-gray-100 pt-5">
              <InfoTile
                icon={<UserRound size={18} />}
                label="Contact Person"
                value={selectedUniversity.contactPerson}
                meta="Position"
              />
              <InfoTile
                icon={<MapPin size={18} />}
                label="Campus Address"
                value={selectedUniversity.address}
              />
              <InfoTile
                icon={<Phone size={18} />}
                label="Contact Number"
                value={selectedUniversity.phone}
              />
              <InfoTile
                icon={<Mail size={18} />}
                label="Email"
                value={selectedUniversity.email}
                copyable
              />
            </div>
          </section>

          <section className="border border-gray-100 rounded-lg p-5">
            <h3 className="text-lg font-bold text-gray-950 mb-4">
              MOA Status & Information
            </h3>

            <div className="flex flex-col gap-3 border-t border-gray-100 pt-5">
              <div className="flex items-center gap-3">
                <div className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700">
                {currentMoa?.fileName || "MOA.pdf"}
                </div>
                <button className="p-2 text-gray-600 hover:text-violet-600">
                  <Eye size={17} />
                </button>
                <button className="p-2 text-gray-600 hover:text-violet-600">
                  <Download size={17} />
                </button>
                <button
                  onClick={() => setShowUploadMoa(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-violet-600 text-white rounded-lg text-sm font-semibold hover:bg-violet-700"
                >
                  <Plus size={16} />
                  Update new MOA
                </button>
              </div>

              <p className="text-[10px] text-gray-500">
                Current MOA Upload Date:{" "}
                {formatDisplayDate(currentMoa?.uploadedAt) ||
                  "January 15, 2024"}
              </p>

              <div className="grid grid-cols-3 gap-3">
                <MoaBadge
                  label="Effective"
                  value={formatShortDate(currentMoa?.startDate) || "Date"}
                  tone="green"
                />
                <MoaBadge
                  label="Expiry"
                  value={formatShortDate(currentMoa?.endDate) || "Date"}
                  tone="red"
                />
                <MoaBadge label="Status" value="ACTIVE" tone="solid" />
              </div>

              <button className="flex items-center justify-center gap-2 w-full bg-violet-600 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-violet-700">
                <History size={16} />
                VIEW MOA HISTORY
              </button>
            </div>
          </section>
        </div>

        <section className="border border-gray-100 rounded-lg p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-950">All Interns</h3>
              <p className="text-xs text-gray-400">
                {universityInterns.length} Members
              </p>
            </div>
            <button className="text-sm font-semibold text-violet-600 hover:text-violet-700">
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-fixed border-collapse">
              <thead>
                <tr className="text-left border-t border-b border-gray-100">
                  {["Intern Name", "Department", "Start Date", "End Date", "Status"].map(
                    (header) => (
                      <th
                        key={header}
                        className="px-3 py-3 text-xs font-medium text-gray-400"
                      >
                        {header}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {universityInterns.length ? (
                  universityInterns.map((intern, index) => (
                    <tr key={intern.id} className="border-b border-gray-50">
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-xs font-bold shrink-0">
                            {getInitials(intern.name)}
                          </div>
                          <span className="text-sm font-medium text-gray-800 truncate">
                            {intern.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-700">
                        {intern.dept || `Department ${index + 1}`}
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-700">
                        {intern.date}
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-700">
                        End Date
                      </td>
                      <td className="px-3 py-3">
                        <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-600 text-xs font-semibold">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-10 text-gray-500">
                      No interns found for this university.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {showUploadMoa && (
          <UploadMOA
            universities={universities}
            initialUniversity={selectedUniversity}
            onClose={() => setShowUploadMoa(false)}
            onApply={async (moa) => {
              const savedMoa = await saveMoaUploadToTemporaryDatabase(moa);
              addSystemLog({
                action: LOG_TYPES.MOA_UPLOADED,
                title: "New MOA received",
                description: `${savedMoa.fileName} was uploaded for ${savedMoa.universityName}.`,
                actorId: currentUser?.id,
                actorName: currentUser?.name || "HR Admin",
                actorRole: currentUser?.role || "HR Admin",
                audience: ["hr-admin", "hr-staff"],
                metadata: {
                  universityId: savedMoa.universityId,
                  universityName: savedMoa.universityName,
                  fileName: savedMoa.fileName,
                  endDate: savedMoa.endDate,
                },
              });
              const targetId = savedMoa.universityId;
              setMoaUploads((previous) => ({
                ...previous,
                [targetId]: savedMoa,
              }));
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="pt-2">
      <div className="flex justify-end mb-5">
        <button
          onClick={() => setShowAddPanel(true)}
          className="flex items-center gap-2 px-4 py-3 bg-violet-600 text-white rounded-lg text-sm font-semibold hover:bg-violet-700 transition-colors"
        >
          <Plus size={18} />
          Add Partner University
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredUniversities.map((university) => (
          <button
            key={university.id}
            onClick={() => setSelectedUniversity(university)}
            className="group flex flex-col text-left"
          >
            <div className="aspect-video bg-gray-50 rounded-xl flex items-center justify-center relative overflow-hidden mb-3 border border-gray-100">
              <Building2
                size={48}
                className="text-gray-300 group-hover:scale-110 group-hover:text-violet-300 transition-all duration-500"
              />
              <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/75 text-white text-[9px] font-bold rounded">
                {university.status.toUpperCase()}
              </div>
            </div>

            <div className="flex gap-3 px-1">
              <div className="w-9 h-9 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center shrink-0 mt-0.5 border border-violet-100">
                <Building2 size={18} />
              </div>
              <div className="flex flex-col overflow-hidden">
                <h4 className="text-gray-900 font-bold text-sm truncate group-hover:text-violet-600">
                  {university.name}
                </h4>
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {university.internCount} Interns
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {showAddPanel && (
        <AddUniversityPanel onClose={() => setShowAddPanel(false)} />
      )}
    </div>
  );
}

function AddUniversityPanel({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/45 backdrop-blur-sm px-6">
      <div className="w-full max-w-[880px] rounded-2xl bg-white shadow-xl border border-gray-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-950">
            Add New University Partner
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-50"
            aria-label="Close add university panel"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-8 py-6">
          <section>
            <h3 className="text-sm font-bold text-gray-950 mb-4">
              University Information
            </h3>
            <div className="space-y-3">
              <FormInput label="University Name" placeholder="University Name" />
              <FormInput label="Branch/Campus" placeholder="Branch/Campus" />
              <FormInput
                label="Full Physical Address"
                placeholder="University Address"
              />
            </div>

            <h3 className="text-sm font-bold text-gray-950 mt-5 mb-4">
              Point of Contact
            </h3>
            <div className="space-y-3">
              <FormInput
                label="Full Name of Contact Person"
                placeholder="University Name"
              />
              <FormInput
                label="Designation/Position"
                placeholder="Branch/Campus"
              />
              <FormInput
                label="Email Address"
                placeholder="University Address"
              />
            </div>
          </section>

          <section className="border border-gray-100 rounded-lg p-4">
            <h3 className="text-sm font-bold text-gray-950 mb-3">
              MOA Partnership Details
            </h3>

            <div className="space-y-3">
              <FormInput label="MOA File Upload" placeholder="University Name" />

              <button className="w-full min-h-[116px] border border-dashed border-violet-400 rounded-lg flex flex-col items-center justify-center text-center text-sm text-gray-600 hover:bg-violet-50/40">
                <span className="w-10 h-10 rounded-lg bg-violet-600 text-white flex items-center justify-center mb-3">
                  <Upload size={20} />
                </span>
                <span>
                  Drag & Drop or{" "}
                  <span className="text-violet-600 font-semibold">
                    choose file
                  </span>{" "}
                  to upload
                </span>
                <span className="text-[10px] text-gray-400 mt-1">
                  Supported formats: docs, pdf
                </span>
              </button>

              <div className="grid grid-cols-2 gap-3">
                <DateInput label="Effectivity Date" />
                <DateInput label="Expiry Date" />
              </div>

              <label className="block">
                <span className="block text-xs font-medium text-gray-700 mb-1.5">
                  Status
                </span>
                <select className="w-full h-12 rounded-lg border border-gray-200 px-3 text-sm text-gray-400 outline-none focus:border-violet-400 bg-white">
                  <option>Status</option>
                  <option>Active</option>
                  <option>Pending</option>
                  <option>Expired</option>
                </select>
              </label>
            </div>
          </section>
        </div>

        <div className="flex justify-end gap-4 px-8 pb-6">
          <button
            onClick={onClose}
            className="w-36 py-3 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="w-36 py-3 rounded-lg bg-violet-600 text-sm font-semibold text-white hover:bg-violet-700"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

function FormInput({ label, placeholder }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-gray-700 mb-1.5">
        {label}
      </span>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full h-12 rounded-lg border border-gray-200 px-4 text-sm outline-none placeholder:text-gray-300 focus:border-violet-400"
      />
    </label>
  );
}

function DateInput({ label }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-gray-700 mb-1.5">
        {label}
      </span>
      <div className="relative">
        <input
          type="text"
          placeholder="Date"
          className="w-full h-12 rounded-lg border border-gray-200 px-3 pr-10 text-sm outline-none placeholder:text-gray-300 focus:border-violet-400"
        />
        <Calendar
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700"
        />
      </div>
    </label>
  );
}

function InfoTile({ icon, label, value, meta, copyable = false }) {
  return (
    <div className="flex gap-3 min-w-0">
      <div className="w-9 h-9 rounded bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 mb-1">{label}</p>
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-gray-800 truncate">{value}</p>
          {copyable && (
            <span className="w-3.5 h-3.5 border border-gray-300 rounded-sm shrink-0" />
          )}
        </div>
        {meta && <p className="text-xs text-gray-500 mt-1">{meta}</p>}
      </div>
    </div>
  );
}

function MoaBadge({ label, value, tone }) {
  const tones = {
    green: "border-emerald-300 bg-emerald-50 text-emerald-700",
    red: "border-red-300 bg-red-50 text-red-700",
    solid: "border-emerald-500 bg-emerald-500 text-white",
  };

  return (
    <div className={`rounded-lg border px-3 py-2 ${tones[tone]}`}>
      <p className="text-[10px] font-medium">{label}</p>
      <p className="text-sm font-bold">{value}</p>
    </div>
  );
}

function getInitials(name) {
  return (name || "UN")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDisplayDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatShortDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
