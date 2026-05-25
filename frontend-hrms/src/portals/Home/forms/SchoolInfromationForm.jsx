export default function SchoolInformationForm({ formData, setFormData }) {
  const baseInput =
    "w-full border border-gray-200 rounded-lg px-4 py-3.5 text-base placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors bg-white";

  const inputClass = `${baseInput} text-gray-900`;

  const selectClass = (hasValue) =>
    `${baseInput} appearance-none ${hasValue ? "text-gray-900" : "text-gray-400"}`;

  const currentYear = new Date().getFullYear();

  const graduationOptions = Array.from({ length: 6 }, (_, i) => {
    const year = currentYear + i;

    return {
      label: year.toString(),
      value: year.toString(),
    };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mt-2">
      <div className="md:col-span-2">
        <input
          type="text"
          name="university"
          placeholder="University"
          value={formData.university || ""}
          onChange={(e) =>
            setFormData({ ...formData, university: e.target.value })
          }
          className={inputClass}
          required
        />
      </div>

      <input
        type="text"
        name="course"
        placeholder="Program/Major"
        value={formData.course || ""}
        onChange={(e) => setFormData({ ...formData, course: e.target.value })}
        className={inputClass}
        required
      />

      <select
        name="yearLevel"
        className={selectClass(formData.yearLevel)}
        value={formData.yearLevel || ""}
        onChange={(e) =>
          setFormData({ ...formData, yearLevel: e.target.value })
        }
        required
      >
        <option value="" disabled>
          Year Level
        </option>
        <option value="1st Year">1st Year</option>
        <option value="2nd Year">2nd Year</option>
        <option value="3rd Year">3rd Year</option>
        <option value="4th Year">4th Year</option>
        <option value="5th Year">5th Year</option>
        <option value="Irregular">Irregular</option>
      </select>

      <input
        type="number"
        name="requiredHours"
        placeholder="Required Internship Hours"
        value={formData.requiredHours || ""}
        onChange={(e) =>
          setFormData({ ...formData, requiredHours: e.target.value })
        }
        className={inputClass}
        required
        min="1"
      />

      <select
        name="expectedGraduation"
        className={selectClass(formData.expectedGraduation)}
        value={formData.expectedGraduation || ""}
        onChange={(e) =>
          setFormData({
            ...formData,
            expectedGraduation: e.target.value,
          })
        }
        required
      >
        <option value="" disabled>
          Expected Graduation
        </option>

        {graduationOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}

        <option value="not-yet-known">Not yet known</option>
      </select>
    </div>
  );
}
