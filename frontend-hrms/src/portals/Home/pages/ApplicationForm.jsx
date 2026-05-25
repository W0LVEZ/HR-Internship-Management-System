import { useState, useEffect } from "react";
import FormStepper from "../components/FormStepper";
import { Link, useNavigate } from "react-router-dom";
import RequiredDocsForm from "../forms/RequiredDocsForm";
import PersonalInfoForm from "../forms/PersonalInfoForm";
import SchoolInformationForm from "../forms/SchoolInfromationForm";

export default function ApplicationForm() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [showIntro, setShowIntro] = useState(true);

  const savedDraft =
    JSON.parse(localStorage.getItem("applicationDraft")) || "{}";

  const [applicationData, setApplicationData] = useState({
    firstName: savedDraft.firstName || "",
    middleName: savedDraft.middleName || "",
    lastName: savedDraft.lastName || "",
    email: savedDraft.email || "",
    expectedGraduation: savedDraft.expectedGraduation || "",
    university: savedDraft.university || "",
    course: savedDraft.course || "",
    yearLevel: savedDraft.yearLevel || "",
    requiredHours: savedDraft.requiredHours || "",
    dateOfBirth: savedDraft.dateOfBirth || "",
    mobileNumber: savedDraft.mobileNumber || "",
    gender: savedDraft.gender || "",
    nationality: savedDraft.nationality || "",
    barangay: savedDraft.barangay || "",
    streetAddress: savedDraft.streetAddress || "",
    region: savedDraft.region || "",
    province: savedDraft.province || "",
    city: savedDraft.city || "",
    zipCode: savedDraft.zipCode || "",
    documents: savedDraft.documents || [],
  });

  useEffect(() => {
    localStorage.setItem("applicationDraft", JSON.stringify(applicationData));
  }, [applicationData]);

  const handleNext = (e) => {
    e.preventDefault();

    // Step 1 -> Step 2 -> Step 3
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    // Step 3 = Submit Application
    const draft = JSON.parse(localStorage.getItem("applicationDraft") || "{}");

    const newApplicant = {
      id: crypto.randomUUID(),
      role: "APPLICANT",
      status: "pending",
      submittedAt: new Date().toISOString(),
      ...draft,
    };

    const applicants = JSON.parse(
      localStorage.getItem("applicants_db") || "[]",
    );

    localStorage.setItem(
      "applicants_db",
      JSON.stringify([...applicants, newApplicant]),
    );

    localStorage.removeItem("applicationDraft");

    navigate("/applicant");
  };

  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  if (showIntro) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="card-panel p-10 text-center">
          <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center text-white">
            <img src="/image.png" alt="logo" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Welcome to Ollopa!</h1>
          <p className="text-sm text-gray-600 mb-6">
            Your account has been successfully created. Please follow the
            instructions below to complete your internship application process.
          </p>
          <div className="border-t border-gray-200 p-2 text-left text-sm">
            <p className="font-bold">Application Instructions:</p>
            <p className="font-bold">If all requirements are met: </p>
            <ul className="text-xs list-disc pl-5 pb-4">
              <li>Your application is officialy under review.</li>
              <li>You will receive a status update via email.</li>
              <li>
                A final decision will be released within 7 business days of your
                submission.
              </li>
            </ul>
          </div>
          <div className=" pb-4 text-left text-sm">
            <p className="font-bold">If requirements are incomplete:</p>
            <ul className="text-xs list-disc pl-5 pb-4">
              <li>
                Your application cannot be submitted until all mandatory fields
                and documents are provided.
              </li>
              <li>
                Your progress will be saved automatically, allowing you to exit
                and log back in to finish it anytime.
              </li>
            </ul>
          </div>

          <button
            onClick={() => setShowIntro(false)}
            className="px-6 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-hover transition"
          >
            Start Aplication
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 overflow-x-hidden">
      <FormStepper currentStep={currentStep} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:p-10 min-h-100 flex flex-col overflow-hidden relative">
        <h2 className="text-lg font-bold text-gray-900 mb-6 transition-all">
          {currentStep === 1 && "Personal Information"}
          {currentStep === 2 && "School Information"}
          {currentStep === 3 && "Required Documents"}
        </h2>

        <form onSubmit={handleNext} className="flex-1 flex flex-col">
          <div className="flex-1 relative overflow-hidden">
            <div
              className="flex w-full transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${(currentStep - 1) * 100}%)` }}
            >
              {/* THE FIX: Wrapping each form in a disabled fieldset when it is not active */}
              <div className="w-full shrink-0 p-1">
                <fieldset
                  disabled={currentStep !== 1}
                  className="border-none p-0 m-0 min-w-0 w-full h-full"
                >
                  <PersonalInfoForm
                    formData={applicationData}
                    setFormData={setApplicationData}
                  />
                </fieldset>
              </div>

              <div className="w-full shrink-0 p-1">
                <fieldset
                  disabled={currentStep !== 2}
                  className="border-none p-0 m-0 min-w-0 w-full h-full"
                >
                  <SchoolInformationForm
                    formData={applicationData}
                    setFormData={setApplicationData}
                  />
                </fieldset>
              </div>

              <div className="w-full shrink-0 p-1">
                <fieldset
                  disabled={currentStep !== 3}
                  className="border-none p-0 m-0 min-w-0 w-full h-full"
                >
                  <RequiredDocsForm
                    formData={applicationData}
                    setFormData={setApplicationData}
                  />
                </fieldset>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-10">
            {currentStep === 1 ? (
              <Link to={"/"}>
                <button
                  type="button"
                  className="px-6 py-2 border border-gray-300 rounded-md text-md font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            )}

            <button
              type="submit"
              className="px-8 py-2 bg-primary text-white rounded-md text-md font-medium hover:bg-gray-800 transition-colors"
            >
              {currentStep === 3 ? "Submit Application" : "Next"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
