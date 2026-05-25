import React from "react";

export default function DashboardStepper({
  currentStep,
  status,
  statusMessage,
}) {
  // Define all steps for the dashboard tracker
  const steps = [
    { num: 1, label: "Profile" },
    { num: 2, label: "Education" },
    { num: 3, label: "Documents" },
    { num: 4, label: "Screening" },
    { num: 5, label: "Decision" },
  ];

  return (
    <div className="w-full mb-8">
      {/* ================= STEPPER TRACKER ================= */}
      <div className="relative flex items-center justify-between w-full mb-8 z-0">
        {/* Background Gray Line */}
        <div className="absolute top-4 left-0 w-full h-[2px] bg-gray-200 -z-10"></div>

        {/* Active Green Progress Line */}
        <div
          className="absolute top-4 left-0 h-[2px] bg-[#10B981] transition-all duration-500 ease-in-out -z-10"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        ></div>

        {/* Render Each Step */}
        {steps.map((step) => {
          const isCompleted = currentStep > step.num;
          const isCurrent = currentStep === step.num;

          return (
            <div
              key={step.num}
              className="flex flex-col items-center bg-white px-2"
            >
              {/* Circle Indicator */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 font-bold text-xs transition-all duration-300 ${
                  isCompleted
                    ? "bg-[#10B981] text-white"
                    : isCurrent
                      ? "bg-[#FFCA28] text-white"
                      : "bg-white border-2 border-gray-100 text-gray-500"
                }`}
              >
                {isCompleted || isCurrent ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : (
                  `0${step.num}`
                )}
              </div>

              {/* Step Label */}
              <span
                className={`text-xs ${
                  isCompleted
                    ? "text-[#10B981] font-bold"
                    : isCurrent
                      ? "text-[#FFCA28] font-bold"
                      : "text-gray-500 font-bold"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* ================= STATUS BANNER ================= */}
      {status === "warning" && (
        <div className="bg-[#FFCA28] rounded-md p-3 flex items-center gap-2 shadow-sm">
          <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center shrink-0">
            <span className="text-[#FFCA28] text-xs font-black">!</span>
          </div>
          <span className="text-sm font-bold text-black tracking-wide">
            Status: {statusMessage}
          </span>
        </div>
      )}

      {/* You can add a success state here later when the application is fully approved! */}
      {status === "success" && (
        <div className="bg-[#10B981] rounded-md p-3 flex items-center gap-2 shadow-sm">
          <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#10B981"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <span className="text-sm font-bold text-white tracking-wide">
            Status: {statusMessage}
          </span>
        </div>
      )}
    </div>
  );
}
