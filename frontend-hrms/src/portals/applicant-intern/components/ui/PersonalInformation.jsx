import { useState } from "react";

export default function PersonalInformation({ applicant = {} }) {
  // Initialize form with data from the submitted applicant
  const [formData, setFormData] = useState({
    firstName: applicant.firstName || "",
    middleName: applicant.middleName || "",
    lastName: applicant.lastName || "",
    dateOfBirth: applicant.dateOfBirth || "",
    mobileNumber: applicant.mobileNumber || "",
    email: applicant.email || "",
    gender: applicant.gender || "",
    nationality: applicant.nationality || "",
    streetAddress: applicant.streetAddress || "",
    barangay: applicant.barangay || "",
    region: applicant.region || "",
    province: applicant.province || "",
    city: applicant.city || "",
    zipCode: applicant.zipCode || "",
  });

  // Handles typing in inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save changes back to localStorage (mock DB)
  const handleSave = (e) => {
    e.preventDefault();

    // Get all applicants
    const applicants = JSON.parse(
      localStorage.getItem("applicants_db") || "[]",
    );

    // Update the correct applicant using ID
    const updatedApplicants = applicants.map((item) =>
      item.id === applicant.id ? { ...item, ...formData } : item,
    );

    // Save updated data
    localStorage.setItem("applicants_db", JSON.stringify(updatedApplicants));

    alert("Personal Information Saved Successfully!");
  };

  // Reusable styles
  const inputStyle =
    "w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[15px] text-gray-900 transition-all bg-white placeholder:text-gray-400";

  const labelStyle = "block text-[13px] text-gray-400 font-medium mb-1.5";

  return (
    <form onSubmit={handleSave} className="w-full animate-fade-in">
      {/* Section Title */}
      <h3 className="text-[18px] font-bold text-gray-900 mb-6">
        Personal Information
      </h3>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mb-8">
        {/* Row 1 */}
        <div>
          <label className={labelStyle}>First Name</label>
          <input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={inputStyle}
            required
          />
        </div>

        <div>
          <label className={labelStyle}>Middle Name</label>
          <input
            name="middleName"
            value={formData.middleName}
            onChange={handleChange}
            className={inputStyle}
          />
        </div>

        {/* Row 2 */}
        <div>
          <label className={labelStyle}>Last Name</label>
          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={inputStyle}
            required
          />
        </div>

        <div>
          <label className={labelStyle}>Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className={inputStyle}
            required
          />
        </div>

        {/* Row 3 */}
        <div>
          <label className={labelStyle}>Mobile Number</label>
          <input
            type="tel"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            className={inputStyle}
            required
          />
        </div>

        <div>
          <label className={labelStyle}>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={inputStyle}
            required
          />
        </div>

        {/* Row 4 */}
        <div>
          <label className={labelStyle}>Gender</label>
          <input
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={inputStyle}
            required
          />
        </div>

        <div>
          <label className={labelStyle}>Nationality</label>
          <input
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
            className={inputStyle}
            required
          />
        </div>

        {/* Row 5 */}
        <div>
          <label className={labelStyle}>Street Name, Building, House No.</label>
          <input
            name="streetAddress"
            value={formData.streetAddress}
            onChange={handleChange}
            className={inputStyle}
            required
          />
        </div>

        <div>
          <label className={labelStyle}>Barangay</label>
          <input
            name="barangay"
            value={formData.barangay}
            onChange={handleChange}
            className={inputStyle}
            required
          />
        </div>

        {/* Row 6 */}
        <div>
          <label className={labelStyle}>Region</label>
          <input
            name="region"
            value={formData.region}
            onChange={handleChange}
            className={inputStyle}
            required
          />
        </div>

        <div>
          <label className={labelStyle}>Province</label>
          <input
            name="province"
            value={formData.province}
            onChange={handleChange}
            className={inputStyle}
            required
          />
        </div>

        {/* Row 7 */}
        <div>
          <label className={labelStyle}>City</label>
          <input
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={inputStyle}
            required
          />
        </div>

        <div>
          <label className={labelStyle}>ZIP Code</label>
          <input
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            className={inputStyle}
            required
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-4">
        <button
          type="submit"
          className="bg-primary hover:bg-primary-hover text-white font-medium py-2.5 px-8 rounded-lg transition-colors text-[14px] shadow-sm"
        >
          Save
        </button>
      </div>
    </form>
  );
}
