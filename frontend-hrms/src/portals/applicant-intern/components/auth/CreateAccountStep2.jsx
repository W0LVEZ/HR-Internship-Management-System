import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function CreateAccountStep2({ formData, setFormData, onBack }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // --- 1. Track our errors here ---
  const [errors, setErrors] = useState({ email: false, match: false });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // --- 2. Clear the red ring as soon as they start typing to fix it ---
    if (name === "email") setErrors((prev) => ({ ...prev, email: false }));
    if (name === "password" || name === "confirmPassword")
      setErrors((prev) => ({ ...prev, match: false }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let hasError = false;
    const newErrors = { email: false, match: false };

    // --- 3. Validate Email (Basic Regex check) ---
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = true;
      hasError = true;
    }

    // --- 4. Validate Passwords Match ---
    if (formData.password !== formData.confirmPassword) {
      newErrors.match = true;
      hasError = true;
    }

    // Apply errors to trigger the red rings
    setErrors(newErrors);

    // Stop the form submission if there are errors
    if (hasError) return;

    localStorage.setItem(
      "applicationDraft",
      JSON.stringify({
        firstName: formData.firstName || "",
        middleName: formData.middleName || "",
        lastName: formData.lastName || "",
        email: formData.email || "",

        expectedGraduation: "",
        dateOfBirth: "",
        mobileNumber: "",
        gender: "",
        nationality: "",
        barangay: "",
        streetAddress: "",
        region: "",
        province: "",
        city: "",
        zipCode: "",
        documents: [],
      }),
    );

    navigate("/application-form");
  };

  return (
    <div>
      <div className="animate-fade-in">
        {/* --- Back Button --- */}
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-gray-500 hover:text-[#111827] mb-8 transition-colors text-[15px] font-medium"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Back
        </button>

        {/* --- Header & Logo --- */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-[#7C3EFF] rounded-full flex items-center justify-center text-white shrink-0">
            <img src="/image.png" alt="" />
          </div>
          <h1 className="text-[26px] font-bold text-[#111827] tracking-wide">
            HRIMS
          </h1>
        </div>

        <h2 className="text-[28px] md:text-[32px] font-bold text-gray-900 mb-2">
          Welcome 👋
        </h2>
        <p className="text-[15px] text-gray-400 mb-6">Create account</p>

        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* --- Email Input --- */}
          {/* Swaps to red-500 if errors.email is true */}
          <div
            className={`mb-4 rounded-lg px-4 py-2.5 transition-all bg-white border focus-within:ring-1 ${errors.email ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-500" : "border-[#D0D5DD] focus-within:border-[#7C3EFF] focus-within:ring-[#7C3EFF]"}`}
          >
            <label className={`input-label ${errors.email ? "error" : ""}`}>
              Email Address {errors.email && <span>- Invalid format</span>}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              className="w-full text-[15px] outline-none text-gray-900 bg-transparent placeholder-gray-400 font-medium"
              required
              onInvalid={(e) =>
                e.target.setCustomValidity(
                  "Please enter a valid email address.",
                )
              }
              onInput={(e) => e.target.setCustomValidity("")}
            />
          </div>

          {/* --- Password Input --- */}
          {/* Swaps to red-500 if errors.match is true */}
          <div
            className={`mb-4 rounded-lg px-4 py-2.5 transition-all bg-white relative border focus-within:ring-1 ${errors.match ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-500" : "border-[#D0D5DD] focus-within:border-[#7C3EFF] focus-within:ring-[#7C3EFF]"}`}
          >
            <label
              className={`block text-[11px] mb-0.5 font-medium ${errors.match ? "text-red-500" : "text-[#7C3EFF]"}`}
            >
              Password{" "}
              {errors.match && (
                <span className="font-bold">- Passwords do not match</span>
              )}
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full text-[15px] outline-none text-gray-900 bg-transparent placeholder-gray-400 font-medium tracking-widest pr-10"
              minLength={8}
              required
              /* This removes the dynamic (your password is 7 characters) message! */
              onInvalid={(e) =>
                e.target.setCustomValidity(
                  "Password must be at least 8 characters long.",
                )
              }
              onInput={(e) => e.target.setCustomValidity("")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#7C3EFF] transition-colors"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              )}
            </button>
          </div>

          {/* --- Confirm Password Input --- */}
          <div
            className={`mb-6 rounded-lg px-4 py-2.5 transition-all bg-white relative border focus-within:ring-1 ${errors.match ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-500" : "border-[#D0D5DD] focus-within:border-[#7C3EFF] focus-within:ring-[#7C3EFF]"}`}
          >
            <label
              className={`block text-[11px] mb-0.5 font-medium ${errors.match ? "text-red-500" : "text-[#7C3EFF]"}`}
            >
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full text-[15px] outline-none text-gray-900 bg-transparent placeholder-gray-400 font-medium tracking-widest pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#7C3EFF] transition-colors"
            >
              {showConfirmPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              )}
            </button>
          </div>

          {/* --- Terms Checkbox --- */}
          <div className="mb-8">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                name="agreedToTerms"
                checked={formData.agreedToTerms}
                onChange={handleChange}
                className="w-[18px] h-[18px] rounded border-gray-300 cursor-pointer accent-[#7C3EFF]"
                required
              />
              <span className="text-[14px] text-gray-700 font-medium">
                I agree to the{" "}
                <span className="text-[#7C3EFF] hover:underline">
                  Terms and Conditions
                </span>
              </span>
            </label>
          </div>

          {/* --- Stepper Dots --- */}
          <div className="flex justify-center gap-2 mb-8">
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <div className="w-2 h-2 rounded-full bg-[#7C3EFF]"></div>
          </div>

          {/* --- Submit Button --- */}
          <button type="submit" className="btn-primary">
            Create account
          </button>

          <p className="text-center text-[14px] text-gray-600 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-[#7C3EFF] hover:text-[#5B29CC] hover:underline transition-colors"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
