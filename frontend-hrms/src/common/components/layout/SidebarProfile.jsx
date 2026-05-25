import { useState, useRef, useEffect } from "react";
import { LogOut, ChevronUp, ChevronDown } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SidebarProfile({
  isCollapsed,
  passedUserName,
  passedRole,
}) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // ================= DYNAMIC APPLICANT OVERRIDE =================
  const initialRole = currentUser?.role || "User";
  let userName = passedUserName || currentUser?.name || "Guest";
  let role = passedRole || currentUser?.role || "User";

  // If the user role is an APPLICANT, read directly from your working local storage database
  if (initialRole === "APPLICANT" || initialRole === "User") {
    const applicants = JSON.parse(
      localStorage.getItem("applicants_db") || "[]",
    );
    const activeApplicant = applicants[applicants.length - 1];

    if (activeApplicant && activeApplicant.firstName) {
      userName = `${activeApplicant.firstName} ${activeApplicant.lastName || ""}`;
      role = "APPLICANT";
    }
  }
  // ==============================================================

  const displayAvatar =
    currentUser?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=f3f4f6&color=374151`;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const ChevronIcon = isOpen ? ChevronDown : ChevronUp;
  const logoutBtnStyle =
    "flex items-center justify-center w-full gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition focus:ring-2 focus:ring-[#7C3EFF]/50 outline-none";

  return (
    <div className="relative mt-auto w-full" ref={menuRef}>
      {isOpen && (
        <div className="absolute bottom-full left-0 w-full mb-3 z-50">
          <button
            onClick={() => {
              logout();
              setIsOpen(false);
              navigate("/login");
            }}
            className={logoutBtnStyle}
          >
            <LogOut size={18} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      )}

      <div
        className={`flex items-center w-full p-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors shadow-sm ${
          isCollapsed ? "justify-center" : "justify-between"
        }`}
      >
        <div
          className={`flex items-center min-w-0 ${
            isCollapsed ? "justify-center" : "gap-3 flex-1"
          }`}
        >
          <img
            src={displayAvatar}
            alt="Avatar"
            onClick={() => setIsOpen(!isOpen)}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0 cursor-pointer"
          />
          {!isCollapsed && (
            <div className="flex flex-col items-start min-w-0 flex-1">
              <span className="text-sm font-semibold text-gray-900 truncate w-full">
                {userName}
              </span>
              <span className="text-xs font-bold text-gray-400 mt-0.5 truncate w-full tracking-wider uppercase">
                {role}
              </span>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-[#7C3EFF]/50 flex-shrink-0 ml-1"
          >
            <ChevronIcon size={18} className="text-gray-500" />
          </button>
        )}
      </div>
    </div>
  );
}
