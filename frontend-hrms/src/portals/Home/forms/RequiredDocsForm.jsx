import FileDropzone from "../../../common/components/ui/FileDropZone";

export default function RequiredDocsForm({ formData, setFormData }) {
  const requiredDocuments = [
    { type: "resume", label: "Resume", required: false },
    { type: "moa", label: "MOA", required: false },
    { type: "endorsement", label: "Endorsement Letter", required: false },
    { type: "schoolId", label: "School Id", required: false },
    {
      type: "assessment",
      label: "Upload Enrolement Assessment",
      required: false,
    },
  ];

  const documents = formData.documents || [];

  const getDocument = (type) => {
    return documents.find((doc) => doc.type === type);
  };

  const updateDocument = (type, label, fileName) => {
    const otherDocuments = documents.filter((doc) => doc.type !== type);

    if (!fileName) {
      setFormData({
        ...formData,
        documents: otherDocuments,
      });
      return;
    }

    const newDocument = {
      type,
      label,
      fileName,
      uploadedAt: new Date().toISOString(),
      status: "Submitted",
      reviewStatus: "Pending",
      remarks: "",
    };

    setFormData({
      ...formData,
      documents: [...otherDocuments, newDocument],
    });
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 mt-2">
      {requiredDocuments.map((doc) => {
        const uploadedDoc = getDocument(doc.type);

        return (
          <FileDropzone
            key={doc.type}
            label={doc.label}
            fileName={uploadedDoc?.fileName || ""}
            setFileName={(fileName) =>
              updateDocument(doc.type, doc.label, fileName)
            }
            required={doc.required}
          />
        );
      })}
    </div>
  );
}
