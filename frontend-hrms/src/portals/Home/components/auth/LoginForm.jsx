import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";

export default function LoginForm({ onForgotPassword }) {
  // --- 1. State Variables ---
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  // --- 2. Global Context ---
  const { login } = useAuth();

  // --- 3. Login Logic ---
  const handleLogin = (e) => {
    e.preventDefault(); // Prevent the page from refreshing

    const loginEmail = email.toLowerCase().trim();
    let db = {};
    try {
      db = JSON.parse(localStorage.getItem("hrims_users_db") || "{}");
    } catch (err) {
      console.error("Failed to parse hrims_users_db", err);
    }

    const matchedUser = Object.values(db).find(
      (user) => user.email && user.email.toLowerCase() === loginEmail,
    );

    if (!matchedUser) {
      alert("User not found! Please check your email or clear your browser's local storage.");
      return;
    }

    const user = login(matchedUser.id);

    if (!user) {
      alert("User not found!");
      return;
    }
    //old
    {
      /*let selectedUserId = "";

        // Determine which ID to use based on the email typed
        if (loginEmail.includes("admin")) selectedUserId = "admin_system";
        else if (loginEmail.includes("staff")) selectedUserId = "staff_hr";
        else if (loginEmail.includes("supervisor")) selectedUserId = "supervisor";
        else if (loginEmail.includes("it")) selectedUserId = "intern_it";
        else if (loginEmail.includes("mktg") || loginEmail.includes("marketing")) selectedUserId = "intern_mktg";
        else if (loginEmail.includes("hr")) selectedUserId = "intern_hr";
        else {
            alert("⚠️ For testing, please include 'admin', 'staff', 'supervisor', 'it', 'hr', or 'mktg' in the email.");
            return;
        }

        // Send that ID to the global AuthContext
        const user = login(selectedUserId);

        // Safety check if the database hasn't loaded
        if (!user) {
            alert("User not found in mock DB. Make sure initializeMockDatabase() is running in App.jsx.");
            return;
        }
            */
    }

    // Route the user to their specific dashboard based on their role
    if (user.role === "ADMIN") navigate("/hr-admin");
    else if (user.role === "HR_STAFF") navigate("/hr-staff");
    else if (user.role === "SUPERVISOR") navigate("/supervisor");
    else if (user.role === "INTERN") navigate("/intern");
  };

  return (
    <div>
      <div className="animate-fade-in">
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
        <p className="text-[15px] text-gray-400 mb-4">Please login here</p>

        {/* --- Helper text for the team during testing --- */}
        <div className="mb-6 p-3 bg-purple-50 text-[#7C3EFF] text-xs rounded-lg border border-purple-100">
          <strong>Testing Accounts:</strong>
          <br /> HR-Admin: <i>elena.admin@company.com</i>
          <br /> HR-Staff: <i>marcus.hr@company.com</i>
          <br /> Supervisor: <i>sarah.supervisor@company.com</i>{" "}
          <i>anna.marketing@company.com</i> <i>paolo.hr@company.com</i>
          <br /> Intern (IT): <i>alex.it@company.com</i>{" "}
          <i>nathan.it@company.com</i> <i>mika.it@company.com</i>
          <br /> Intern (HR): <i>david.hr@company.com</i>{" "}
          <i>kyla.hr@company.com</i> <i>marco.hr@company.com</i>
          <br /> Intern (Marketing): <i>chloe.mktg@company.com</i>{" "}
          <i>bianca.mktg@company.com</i> <i>jared.mktg@company.com</i>
          <br /> Any password works!
        </div>

        <form onSubmit={handleLogin} className="flex flex-col">
          {/* --- Email Input  --- */}
          <div className="mb-4 border border-[#D0D5DD] rounded-lg px-4 py-2.5 focus-within:border-[#7C3EFF] focus-within:ring-1 focus-within:ring-[#7C3EFF] transition-all bg-white">
            <label className="block text-[11px] text-[#7C3EFF] mb-0.5 font-medium">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full text-[15px] outline-none text-gray-900 bg-transparent placeholder-gray-400 font-medium"
              required
            />
          </div>

          {/* --- Password Input --- */}
          <div className="mb-6 border border-[#D0D5DD] rounded-lg px-4 py-2.5 focus-within:border-[#7C3EFF] focus-within:ring-1 focus-within:ring-[#7C3EFF] transition-all bg-white relative">
            <label className="block text-[11px] text-[#7C3EFF] mb-0.5 font-medium">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              className="w-full text-[15px] outline-none text-gray-900 bg-transparent placeholder-gray-400 font-medium tracking-widest pr-10"
              required
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

          {/* --- Options Row --- */}
          <div className="flex items-center justify-between mb-8">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                className="w-[18px] h-[18px] rounded border-gray-300 cursor-pointer accent-[#7C3EFF]"
              />
              <span className="text-sm text-gray-700 font-medium">
                Remember Me
              </span>
            </label>

            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-[#7C3EFF] hover:text-[#5B29CC] font-medium transition-colors"
            >
              Forgot Password?
            </button>
          </div>

          {/* --- Login Button --- */}
          <button
            type="submit"
            className="w-full bg-[#7C3EFF] hover:bg-[#6A32E6] text-white font-medium py-[14px] rounded-lg transition-colors text-[15px]"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
