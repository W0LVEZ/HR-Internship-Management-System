import { useEffect, useState, useRef } from "react";
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
  Copy,
  Check,
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
  onUpdateUniversities,
  interns = [],
  search = "",
}) {
  const { currentUser } = useAuth();
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [showUploadMoa, setShowUploadMoa] = useState(false);
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [moaUploads, setMoaUploads] = useState({});

  useEffect(() => {
    setMoaUploads(getStoredMoaUploads());
  }, []);

  useEffect(() => {
    if (selectedUniversity) {
      const updated = universities.find((u) => String(u.id) === String(selectedUniversity.id));
      if (updated) {
        setSelectedUniversity(updated);
      }
    }
  }, [universities]);

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

          <button
            type="button"
            onClick={() => setShowEditPanel(true)}
            className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
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
                <button
                  type="button"
                  onClick={() => {
                    if (!currentMoa || !currentMoa.fileDataUrl) {
                      alert("No uploaded document content to view!");
                      return;
                    }
                    const newWindow = window.open();
                    if (newWindow) {
                      newWindow.document.write(
                        `<iframe src="${currentMoa.fileDataUrl}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
                      );
                    } else {
                      alert("Popup blocker prevented opening the document. Please allow popups.");
                    }
                  }}
                  className="p-2 text-gray-600 hover:text-violet-600 cursor-pointer"
                  title="View MOA"
                >
                  <Eye size={17} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!currentMoa || !currentMoa.fileDataUrl) {
                      alert("No uploaded document to download!");
                      return;
                    }
                    const link = document.createElement("a");
                    link.href = currentMoa.fileDataUrl;
                    link.download = currentMoa.fileName || "MOA.pdf";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="p-2 text-gray-600 hover:text-violet-600 cursor-pointer"
                  title="Download MOA"
                >
                  <Download size={17} />
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadMoa(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-violet-600 text-white rounded-lg text-sm font-semibold hover:bg-violet-700 cursor-pointer"
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
                <MoaBadge
                  label="Status"
                  value={currentMoa?.endDate && new Date(currentMoa.endDate) < new Date() ? "EXPIRED" : "ACTIVE"}
                  tone={currentMoa?.endDate && new Date(currentMoa.endDate) < new Date() ? "red" : "solid"}
                />
              </div>

              <button
                type="button"
                onClick={() => setShowHistoryPanel(true)}
                className="flex items-center justify-center gap-2 w-full bg-violet-600 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-violet-700 cursor-pointer"
              >
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

              // Determine new status based on MOA expiration
              let newStatus = "Active Partner";
              if (savedMoa.endDate) {
                const today = new Date();
                const expiry = new Date(savedMoa.endDate);
                if (expiry < today) {
                  newStatus = "Expired Partner";
                }
              }

              const updatedUnis = universities.map((u) => {
                if (String(u.id) === String(targetId)) {
                  const updatedU = {
                    ...u,
                    status: newStatus,
                  };
                  setSelectedUniversity(updatedU);
                  return updatedU;
                }
                return u;
              });
              onUpdateUniversities?.(updatedUnis);
            }}
          />
        )}

        {showEditPanel && (
          <EditUniversityPanel
            university={selectedUniversity}
            onClose={() => setShowEditPanel(false)}
            onSave={(updatedUni) => {
              const updatedUnis = universities.map((u) =>
                String(u.id) === String(updatedUni.id) ? updatedUni : u
              );
              onUpdateUniversities?.(updatedUnis);
            }}
          />
        )}

        {showHistoryPanel && (
          <MoaHistoryModal
            currentMoa={currentMoa}
            onClose={() => setShowHistoryPanel(false)}
          />
        )}
      </div>
    );
  }

  const totalPartners = universities.length;
  const activePartners = universities.filter(
    (u) => u.status === "Active Partner" || u.status === "Active",
  ).length;
  const pendingPartners = universities.filter(
    (u) => u.status === "Pending",
  ).length;
  const expiredPartners = universities.filter(
    (u) => u.status === "Expired" || u.status === "Expired Partner",
  ).length;

  return (
    <div className="pt-2">
      {/* Combined MOA Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center shrink-0 border border-violet-100">
            <Building2 size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Partners</p>
            <p className="text-xl font-bold text-gray-900">{totalPartners}</p>
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <Building2 size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Active MOA</p>
            <p className="text-xl font-bold text-emerald-600">{activePartners}</p>
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 border border-amber-100">
            <Building2 size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Pending MOA</p>
            <p className="text-xl font-bold text-amber-500">{pendingPartners}</p>
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center shrink-0 border border-rose-100">
            <Building2 size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Expired MOA</p>
            <p className="text-xl font-bold text-rose-500">{expiredPartners}</p>
          </div>
        </div>
      </div>

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
        <AddUniversityPanel
          onClose={() => setShowAddPanel(false)}
          onSave={async (newUni, moaDates) => {
            const updatedUnis = [...universities, newUni];
            onUpdateUniversities?.(updatedUnis);

            if (moaDates.file || moaDates.startDate || moaDates.endDate) {
              const uploadFile = moaDates.file || new File([""], "MOA.pdf", { type: "application/pdf" });
              await saveMoaUploadToTemporaryDatabase({
                university: newUni,
                startDate: moaDates.startDate,
                endDate: moaDates.endDate,
                applyToAll: false,
                file: uploadFile,
                uploadedAt: new Date().toISOString(),
              });
              setMoaUploads(getStoredMoaUploads());
            }
          }}
        />
      )}
    </div>
  );
}

function AddUniversityPanel({ onClose, onSave }) {
  const fileInputRef = useRef(null);
  const [name, setName] = useState("");
  const [branch, setBranch] = useState("");
  const [address, setAddress] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("Active Partner");
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files) => {
    const nextFile = files?.[0];
    if (nextFile) {
      setFile(nextFile);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !branch || !contactPerson) {
      alert("Please fill in all required fields.");
      return;
    }

    onSave({
      id: `uni_${Date.now()}`,
      name,
      branch,
      address,
      contactPerson,
      phone,
      email,
      status,
      internCount: 0
    }, {
      startDate,
      endDate,
      file
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/45 backdrop-blur-sm px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-[880px] rounded-2xl bg-white shadow-xl border border-gray-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-950">
            Add New University Partner
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-50"
            aria-label="Close add university panel"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-8 py-6">
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-gray-950">
              University Information
            </h3>
            <div className="space-y-3">
              <FormInput label="University Name *" placeholder="University Name" value={name} onChange={e => setName(e.target.value)} required />
              <FormInput label="Branch/Campus *" placeholder="Branch/Campus" value={branch} onChange={e => setBranch(e.target.value)} required />
              <FormInput
                label="Full Physical Address"
                placeholder="University Address"
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
            </div>

            <h3 className="text-sm font-bold text-gray-950 pt-2">
              Point of Contact
            </h3>
            <div className="space-y-3">
              <FormInput
                label="Full Name of Contact Person *"
                placeholder="Contact Person"
                value={contactPerson}
                onChange={e => setContactPerson(e.target.value)}
                required
              />
              <FormInput
                label="Designation/Position"
                placeholder="e.g. Dean, Coordinator"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
              <FormInput
                label="Email Address"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </section>

          <section className="border border-gray-100 rounded-lg p-4 space-y-4">
            <h3 className="text-sm font-bold text-gray-950">
              MOA Partnership Details
            </h3>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                MOA File Upload
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                onDragEnter={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragOver={(e) => event.preventDefault()}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  handleFiles(e.dataTransfer.files);
                }}
                className={`w-full min-h-[116px] border border-dashed rounded-lg flex flex-col items-center justify-center text-center text-sm px-4 py-3 transition-colors ${
                  isDragging
                    ? "border-violet-500 bg-violet-50 text-violet-700"
                    : "border-violet-400 text-gray-600 hover:bg-violet-50/40"
                }`}
              >
                <span className="w-10 h-10 rounded-lg bg-violet-600 text-white flex items-center justify-center mb-2 shrink-0">
                  <Upload size={20} />
                </span>
                <span className="font-semibold block truncate max-w-[300px]">
                  {file ? file.name : "Drag & Drop or choose file to upload"}
                </span>
                <span className="text-[10px] text-gray-400 mt-1">
                  Supported formats: docs, pdf
                </span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".doc,.docx,.pdf"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />

              <div className="grid grid-cols-2 gap-3">
                <DateInput label="Effectivity Date" value={startDate} onChange={setStartDate} />
                <DateInput label="Expiry Date" value={endDate} onChange={setEndDate} />
              </div>

              <label className="block">
                <span className="block text-xs font-medium text-gray-700 mb-1.5">
                  Status
                </span>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  className="w-full h-12 rounded-lg border border-gray-200 px-3 text-sm text-gray-700 outline-none focus:border-violet-400 bg-white"
                >
                  <option value="Active Partner">Active Partner</option>
                  <option value="Pending">Pending</option>
                  <option value="Expired">Expired</option>
                </select>
              </label>
            </div>
          </section>
        </div>

        <div className="flex justify-end gap-4 px-8 pb-6 border-t border-gray-50 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="w-36 py-3 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-36 py-3 rounded-lg bg-violet-600 text-sm font-semibold text-white hover:bg-violet-700"
          >
            Apply
          </button>
        </div>
      </form>
    </div>
  );
}

function EditUniversityPanel({ university, onClose, onSave }) {
  const [name, setName] = useState(university.name);
  const [branch, setBranch] = useState(university.branch);
  const [address, setAddress] = useState(university.address);
  const [contactPerson, setContactPerson] = useState(university.contactPerson);
  const [phone, setPhone] = useState(university.phone);
  const [email, setEmail] = useState(university.email);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...university,
      name,
      branch,
      address,
      contactPerson,
      phone,
      email,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/45 backdrop-blur-sm px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-[600px] rounded-2xl bg-white shadow-xl border border-gray-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-950">
            Edit University Profile
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-50"
            aria-label="Close edit profile panel"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <FormInput label="University Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <FormInput label="Branch/Campus" value={branch} onChange={(e) => setBranch(e.target.value)} required />
          <FormInput label="Full Physical Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Contact Person" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} required />
            <FormInput label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
          <FormInput label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="flex justify-end gap-4 px-6 pb-6 pt-2 border-t border-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="w-32 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-32 py-2.5 rounded-lg bg-violet-600 text-sm font-semibold text-white hover:bg-violet-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

function MoaHistoryModal({ currentMoa, onClose }) {
  const history = currentMoa?.history || [];

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-[500px] rounded-2xl bg-white shadow-2xl border border-gray-100 flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2 text-violet-600">
            <History size={20} />
            <h2 className="text-lg font-bold text-gray-950">MOA Upload History</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition"
            aria-label="Close MOA history modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {history.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">No history records found.</p>
          ) : (
            <div className="relative border-l border-gray-200 ml-3 pl-5 space-y-6">
              {history.map((record, index) => {
                const isCurrent = index === 0;
                return (
                  <div key={record.id || index} className="relative">
                    <span className={`absolute -left-[27px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white ${isCurrent ? 'bg-violet-600 ring-4 ring-violet-50' : 'bg-gray-300'}`} />
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-bold text-gray-900 truncate max-w-[200px]" title={record.fileName}>
                            {record.fileName}
                          </p>
                          <p className="text-[11px] text-gray-400">
                            Uploaded: {new Date(record.uploadedAt).toLocaleString()}
                          </p>
                        </div>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 text-[10px] font-bold">
                            CURRENT
                          </span>
                        )}
                      </div>
                      <div className="flex gap-4 text-xs text-gray-600">
                        <div>
                          <span className="font-semibold block text-[10px] text-gray-400 uppercase">Effective</span>
                          <span>{formatShortDate(record.startDate) || "N/A"}</span>
                        </div>
                        <div>
                          <span className="font-semibold block text-[10px] text-gray-400 uppercase">Expiry</span>
                          <span>{formatShortDate(record.endDate) || "N/A"}</span>
                        </div>
                      </div>
                      {record.fileDataUrl && (
                        <div className="flex gap-2 pt-1 border-t border-gray-200/50">
                          <button
                            type="button"
                            onClick={() => {
                              const newWindow = window.open();
                              if (newWindow) {
                                newWindow.document.write(
                                  `<iframe src="${record.fileDataUrl}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
                                );
                              }
                            }}
                            className="text-xs font-semibold text-violet-600 hover:text-violet-700"
                          >
                            View Document
                          </button>
                          <span className="text-gray-300 text-xs">|</span>
                          <button
                            type="button"
                            onClick={() => {
                              const link = document.createElement("a");
                              link.href = record.fileDataUrl;
                              link.download = record.fileName;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                            className="text-xs font-semibold text-violet-600 hover:text-violet-700"
                          >
                            Download
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/80 rounded-b-2xl flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-sm font-semibold text-gray-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function FormInput({ label, placeholder, value, onChange, type = "text", required = false }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-gray-700 mb-1.5">
        {label}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full h-12 rounded-lg border border-gray-200 px-4 text-sm outline-none placeholder:text-gray-300 focus:border-violet-400 bg-white text-gray-700"
      />
    </label>
  );
}

function DateInput({ label, value, onChange, required = false }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-gray-700 mb-1.5">
        {label}
      </span>
      <div className="relative">
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="w-full h-12 rounded-lg border border-gray-200 px-3 pr-10 text-sm outline-none focus:border-violet-400 bg-white text-gray-700"
        />
      </div>
    </label>
  );
}

function InfoTile({ icon, label, value, meta, copyable = false }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex gap-3 min-w-0">
      <div className="w-9 h-9 rounded bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-400 mb-1">{label}</p>
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-gray-800 truncate">{value}</p>
          {copyable && (
            <button
              onClick={handleCopy}
              className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-violet-600 transition shrink-0 cursor-pointer"
              title="Copy to clipboard"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            </button>
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
