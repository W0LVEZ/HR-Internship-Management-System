import { useState, useEffect } from "react";
import { Upload } from "lucide-react";

export default function Documents({ applicant }) {
  // These are the documents required from the applicant.
  // Keep the "type" values consistent because they are used to match saved documents.
  const requiredDocuments = [
    { type: "resume", label: "Resume" },
    { type: "moa", label: "MOA" },
    { type: "endorsement", label: "Endorsement Letter" },
    { type: "schoolId", label: "School ID" },
    { type: "assessment", label: "Enrollment Assessment" },
  ];

  // Start them all as null.
  // If a file exists in applicants_db, this will be filled inside useEffect.
  const [uploadedFiles, setUploadedFiles] = useState({
    resume: null,
    moa: null,
    endorsement: null,
    schoolId: null,
    assessment: null,
  });

  // Watch the applicant documents.
  // As soon as applicants_db data loads, update the displayed files.
  useEffect(() => {
    const documents = applicant?.documents || [];

    const getSubmittedFile = (docType) => {
      const doc = documents.find((item) => item.type === docType);

      if (!doc) return null;

      return {
        ...doc,
        name: doc.fileName,
      };
    };

    setUploadedFiles({
      resume: getSubmittedFile("resume"),
      moa: getSubmittedFile("moa"),
      endorsement: getSubmittedFile("endorsement"),
      schoolId: getSubmittedFile("schoolId"),
      assessment: getSubmittedFile("assessment"),
    });
  }, [applicant]);

  const formatDate = (dateValue) => {
    if (!dateValue) return "-";

    return new Date(dateValue).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
  };

  // Handle when a user uploads a missing/rejected file.
  // We only save the file name and metadata, not the actual file.
  const handleFileChange = (e, docType, label) => {
    const file = e.target.files[0];

    if (!file) return;

    const newFileMeta = {
      type: docType,
      label,
      fileName: file.name,
      name: file.name,
      uploadedAt: new Date().toISOString(),
      status: "Submitted",
      reviewStatus: "Pending",
      remarks: "",
    };

    setUploadedFiles((prev) => ({
      ...prev,
      [docType]: newFileMeta,
    }));

    const applicants = JSON.parse(
      localStorage.getItem("applicants_db") || "[]",
    );

    const updatedApplicants = applicants.map((item) => {
      if (item.id !== applicant.id) return item;

      const currentDocs = item.documents || [];
      const otherDocs = currentDocs.filter((doc) => doc.type !== docType);

      return {
        ...item,
        documents: [...otherDocs, newFileMeta],
      };
    });

    localStorage.setItem("applicants_db", JSON.stringify(updatedApplicants));
  };

  const UploadBox = ({ id, label, docType }) => {
    const file = uploadedFiles[docType];

    const isRejected = file?.reviewStatus === "Rejected";
    const shouldShowUploadBox = !file || isRejected;

    return (
      <div className="flex flex-col">
        <label className="block text-[13px] text-gray-400 font-medium mb-1.5">
          {isRejected ? `${label} - Re-upload Required` : label}
        </label>

        {shouldShowUploadBox ? (
          <>
            {isRejected && file?.remarks && (
              <p className="mb-2 text-xs text-red-500">
                Remarks: {file.remarks}
              </p>
            )}

            <div className="relative border-2 border-dashed border-[#7C3EFF]/40 rounded-xl p-8 flex flex-col items-center justify-center bg-white hover:bg-[#F4F0FF] transition-all cursor-pointer group">
              <input
                type="file"
                id={id}
                accept=".pdf, .jpg, .jpeg"
                onChange={(e) => handleFileChange(e, docType, label)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              <div className="text-center">
                <div className="w-11 h-11 bg-[#7C3EFF] rounded-xl flex items-center justify-center mx-auto mb-3 text-white shadow-sm group-hover:-translate-y-1 transition-transform duration-300">
                  <Upload size={20} strokeWidth={2} />
                </div>

                <p className="text-[13px] text-gray-600 font-medium">
                  Drag & Drop or{" "}
                  <span className="text-gray-900">choose file</span> to upload
                </p>

                <p className="text-[11px] text-gray-400 mt-1.5">
                  Supported formats : Jpeg, pdf
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
            <p className="text-sm font-semibold text-gray-900">
              Submitted File
            </p>

            <p className="mt-2 text-sm font-medium text-gray-900 truncate max-w-[260px]">
              {file.fileName || file.name}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Submitted on {formatDate(file.uploadedAt)}
            </p>

            <div className="mt-3">
              <span className="rounded-full bg-warning-light px-3 py-1 text-xs font-semibold text-yellow-700">
                {file.reviewStatus || "Pending"}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <form className="w-full animate-fade-in">
      <h3 className="text-[18px] font-bold text-gray-900 mb-6">
        Required Documents
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 mb-8">
        {requiredDocuments.map((doc) => (
          <UploadBox
            key={doc.type}
            id={`doc-${doc.type}`}
            label={doc.label}
            docType={doc.type}
          />
        ))}
      </div>
    </form>
  );
}
