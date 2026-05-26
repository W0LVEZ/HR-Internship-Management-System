import { useMemo, useRef, useState } from "react";
import { Calendar, ChevronDown, Upload, X } from "lucide-react";

export default function UploadMOA({
  universities = [],
  initialUniversity,
  onClose,
  onApply,
}) {
  const fileInputRef = useRef(null);
  const initialUniversityId = initialUniversity?.id ?? universities[0]?.id ?? "";
  const [selectedUniversityId, setSelectedUniversityId] = useState(
    initialUniversityId,
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [applyToAll, setApplyToAll] = useState(false);
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedUniversity = useMemo(
    () =>
      universities.find(
        (university) => String(university.id) === String(selectedUniversityId),
      ) || initialUniversity,
    [initialUniversity, selectedUniversityId, universities],
  );

  const handleFiles = (files) => {
    const nextFile = files?.[0];
    if (nextFile) {
      setFile(nextFile);
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError("Please choose an MOA file before applying.");
      return;
    }

    setIsSubmitting(true);
    await onApply?.({
      university: selectedUniversity,
      startDate,
      endDate,
      applyToAll,
      file,
      uploadedAt: new Date().toISOString(),
    });
    setIsSubmitting(false);
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-gray-100/60 backdrop-blur-sm px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[520px] rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-950">Upload New MOA</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:bg-gray-50 hover:text-gray-700"
            aria-label="Close upload MOA"
          >
            <X size={17} />
          </button>
        </div>

        <div className="space-y-3 px-5 py-4">
          <label className="relative block">
            <select
              value={selectedUniversityId}
              onChange={(event) => setSelectedUniversityId(event.target.value)}
              className="h-12 w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 pr-10 text-sm text-gray-700 outline-none focus:border-violet-400"
              required
            >
              <option value="" disabled>
                University/Branch
              </option>
              {universities.map((university) => (
                <option key={university.id} value={university.id}>
                  {university.name} - {university.branch}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-700"
            />
          </label>

          <DateField
            label="Start of MOA"
            value={startDate}
            onChange={setStartDate}
          />
          <DateField label="End of MOA" value={endDate} onChange={setEndDate} />

          <label className="flex items-start gap-3 rounded-lg py-1">
            <input
              type="checkbox"
              checked={applyToAll}
              onChange={(event) => setApplyToAll(event.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-violet-600"
            />
            <span>
              <span className="block text-sm font-bold text-gray-950">
                Apply To All
              </span>
              <span className="mt-1 block max-w-[360px] text-[11px] leading-4 text-gray-500">
                Uploading this document will verify the MOA requirement for all
                pending applicants from this branch.
              </span>
            </span>
          </label>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragging(false);
              handleFiles(event.dataTransfer.files);
            }}
            className={`flex min-h-[124px] w-full flex-col items-center justify-center rounded-lg border border-dashed px-4 text-center transition-colors ${
              isDragging
                ? "border-violet-500 bg-violet-50"
                : "border-gray-400 hover:border-violet-400 hover:bg-violet-50/40"
            }`}
          >
            <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white">
              <Upload size={18} />
            </span>
            <span className="text-sm font-medium text-gray-800">
              {file ? file.name : "Drag & Drop or choose file to upload"}
            </span>
            <span className="mt-1 text-[11px] text-gray-400">
              Supported formats: docs, pdf
            </span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".doc,.docx,.pdf"
            className="hidden"
            onChange={(event) => handleFiles(event.target.files)}
          />

          {error && <p className="text-xs font-medium text-red-600">{error}</p>}
        </div>

        <div className="flex justify-end gap-4 px-5 pb-5 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="h-11 w-36 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-36 rounded-lg bg-black text-sm font-semibold text-white hover:bg-gray-900 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {isSubmitting ? "Saving..." : "Apply"}
          </button>
        </div>
      </form>
    </div>
  );
}

function DateField({ label, value, onChange }) {
  return (
    <label className="relative block">
      <input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-lg border border-gray-200 px-3 pr-10 text-sm text-gray-700 outline-none placeholder:text-gray-300 focus:border-violet-400"
        required
      />
      {!value && (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 bg-white pr-2 text-sm text-gray-300">
          {label}
        </span>
      )}
      <Calendar
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-700"
      />
    </label>
  );
}
