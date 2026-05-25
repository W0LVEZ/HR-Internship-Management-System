import { useState } from "react";
import { phLocations } from "../../../common/config/phLocations";

export default function PersonalInfoForm({ formData, setFormData }) {
  const [errors, setErrors] = useState({ mobile: "", email: "", zip: "" });

  const baseInput =
    "w-full border border-gray-200 rounded-lg px-4 py-3.5 text-md placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors bg-white";

  const inputClass = `${baseInput} text-gray-900`;
  const selectClass = (hasValue) =>
    `${baseInput} appearance-none ${
      hasValue ? "text-gray-900" : "text-gray-400"
    }`;

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateMobile = (value) => {
    const cleanValue = value.replace(/\D/g, "").slice(0, 11);
    updateField("mobileNumber", cleanValue);

    if (cleanValue.length > 0 && cleanValue.length < 11) {
      setErrors((prev) => ({
        ...prev,
        mobile: "Must be a valid 11-digit number",
      }));
    } else {
      setErrors((prev) => ({ ...prev, mobile: "" }));
    }
  };

  const validateEmail = (value) => {
    updateField("email", value);

    if (value && !value.includes("@")) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const validateZip = (value) => {
    const cleanValue = value.replace(/\D/g, "").slice(0, 5);
    updateField("zipCode", cleanValue);

    if (
      cleanValue.length > 0 &&
      cleanValue.length !== 4 &&
      cleanValue.length !== 5
    ) {
      setErrors((prev) => ({
        ...prev,
        zip: "Must be a valid 4 or 5-digit number",
      }));
    } else {
      setErrors((prev) => ({ ...prev, zip: "" }));
    }
  };

  const regions = Object.keys(phLocations);

  const provinces = formData.region
    ? Object.keys(phLocations[formData.region])
    : [];

  const cities =
    formData.region && formData.province
      ? phLocations[formData.region][formData.province]
      : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mt-2">
      <input
        type="text"
        name="firstName"
        placeholder="First Name"
        value={formData.firstName || ""}
        onChange={(e) => updateField("firstName", e.target.value)}
        className={`
            ${inputClass}`}
        required
      />

      <input
        type="text"
        name="middleName"
        placeholder="Middle Name"
        value={formData.middleName || ""}
        onChange={(e) => updateField("middleName", e.target.value)}
        className={inputClass}
      />

      <input
        type="text"
        name="lastName"
        placeholder="Last Name"
        value={formData.lastName || ""}
        onChange={(e) => updateField("lastName", e.target.value)}
        className={inputClass}
        required
      />

      <input
        type="date"
        name="dateOfBirth"
        value={formData.dateOfBirth || ""}
        onChange={(e) => updateField("dateOfBirth", e.target.value)}
        className={inputClass}
        required
      />

      <div className="flex flex-col gap-1">
        <input
          type="tel"
          name="mobileNumber"
          placeholder="Mobile Number"
          value={formData.mobileNumber || ""}
          onChange={(e) => validateMobile(e.target.value)}
          className={`${inputClass} ${
            errors.mobile
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : ""
          }`}
          required
        />
        {errors.mobile && (
          <span className="text-xs text-red-500 px-1">{errors.mobile}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email || ""}
          onChange={(e) => validateEmail(e.target.value)}
          className={`${inputClass} ${
            errors.email
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : ""
          }`}
          required
        />
        {errors.email && (
          <span className="text-xs text-red-500 px-1">{errors.email}</span>
        )}
      </div>

      <select
        name="gender"
        className={selectClass(formData.gender)}
        value={formData.gender || ""}
        onChange={(e) => updateField("gender", e.target.value)}
        required
      >
        <option value="" disabled>
          Gender
        </option>
        <option value="male" className="text-gray-900">
          Male
        </option>
        <option value="female" className="text-gray-900">
          Female
        </option>
        <option value="prefer-not-to-say" className="text-gray-900">
          Prefer not to say
        </option>
      </select>

      <select
        name="nationality"
        className={selectClass(formData.nationality)}
        value={formData.nationality || ""}
        onChange={(e) => updateField("nationality", e.target.value)}
        required
      >
        <option value="" disabled>
          Nationality
        </option>
        <option value="filipino" className="text-gray-900">
          Filipino
        </option>
        <option value="foreign-national" className="text-gray-900">
          Foreign National
        </option>
      </select>

      <input
        type="text"
        name="streetAddress"
        placeholder="Street Name, Building, House No."
        value={formData.streetAddress || ""}
        onChange={(e) => updateField("streetAddress", e.target.value)}
        className={inputClass}
        required
      />

      <input
        type="text"
        name="barangay"
        placeholder="Barangay"
        value={formData.barangay || ""}
        onChange={(e) => updateField("barangay", e.target.value)}
        className={`text-gray-400${inputClass}`}
        required
      />

      <select
        name="region"
        className={selectClass(formData.region)}
        value={formData.region || ""}
        onChange={(e) =>
          setFormData({
            ...formData,
            region: e.target.value,
            province: "",
            city: "",
          })
        }
        required
      >
        <option value="" disabled>
          Region
        </option>

        {regions.map((region) => (
          <option key={region} value={region} className="text-gray-900">
            {region}
          </option>
        ))}
      </select>

      <select
        name="province"
        className={selectClass(formData.province)}
        value={formData.province || ""}
        onChange={(e) =>
          setFormData({
            ...formData,
            province: e.target.value,
            city: "",
          })
        }
        disabled={!formData.region}
        required
      >
        <option value="" disabled>
          Province
        </option>

        {provinces.map((province) => (
          <option key={province} value={province} className="text-gray-900">
            {province}
          </option>
        ))}
      </select>

      <select
        name="city"
        className={selectClass(formData.city)}
        value={formData.city || ""}
        onChange={(e) => updateField("city", e.target.value)}
        disabled={!formData.province}
        required
      >
        <option value="" disabled>
          City
        </option>

        {cities.map((city) => (
          <option key={city} value={city} className="text-gray-900">
            {city}
          </option>
        ))}
      </select>

      <div className="flex flex-col gap-1">
        <input
          type="text"
          name="zipCode"
          placeholder="ZIP Code"
          value={formData.zipCode || ""}
          onChange={(e) => validateZip(e.target.value)}
          className={`${inputClass} ${
            errors.zip
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : ""
          }`}
          required
        />
        {errors.zip && (
          <span className="text-xs text-red-500 px-1">{errors.zip}</span>
        )}
      </div>
    </div>
  );
}
